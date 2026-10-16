/**
 * Supabase Edge Function: generate-theme
 * One-shot (or limited re-roll) LLM → theme_config JSONB on profiles.
 *
 * Deploy: supabase functions deploy generate-theme
 * Secrets: OPENAI_API_KEY or ANTHROPIC_API_KEY, SUPABASE_SERVICE_ROLE_KEY
 *
 * POST /functions/v1/generate-theme
 * Body: { "vibe": "string description", "reroll"?: boolean }
 * Auth: Bearer <user access token>
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const THEME_SCHEMA_HINT = `{
  "themeName": string,
  "colors": {
    "primary": "#RRGGBB",
    "secondary": "#RRGGBB",
    "background": "#RRGGBB",
    "surface": "#RRGGBB",
    "text": "#RRGGBB",
    "accent": "#RRGGBB"
  },
  "typography": { "fontStyle": "mono" | "serif" | "sans" | "display" },
  "geometry": { "borderRadius": "sharp" | "subtle" | "round" | "pill" },
  "customEffects": { "glow": boolean, "scanlines": boolean, "glassmorphism": boolean }
}`;

const SYSTEM = `You are a visual design token generator for personal profile skins (MySpace/Bebo era energy, modern CSS).
Given a user's vibe description, output ONLY valid JSON matching this schema — no markdown, no commentary:
${THEME_SCHEMA_HINT}

Rules:
- All colors must be 6-digit hex (#RRGGBB), high contrast between text and background/surface.
- Prefer cohesive palettes; avoid pure #000000 / #FFFFFF unless the vibe demands it.
- themeName: short evocative label (2–4 words).
- fontStyle and borderRadius must be exactly one of the allowed enums.
- customEffects booleans should reflect the vibe (e.g. cyber → scanlines/glow; soft dream → glassmorphism).
- Do not invent extra keys.`;

const MAX_REROLLS = 3; // total generations after the first

const RADIUS_MAP: Record<string, string> = {
  sharp: '0px',
  subtle: '6px',
  round: '14px',
  pill: '999px',
};

function corsHeaders(origin: string | null) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

function isHex(c: unknown): c is string {
  return typeof c === 'string' && /^#[0-9A-Fa-f]{6}$/.test(c);
}

function validateTheme(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object') return null;
  const t = raw as Record<string, unknown>;
  const colors = t.colors as Record<string, unknown> | undefined;
  const typography = t.typography as Record<string, unknown> | undefined;
  const geometry = t.geometry as Record<string, unknown> | undefined;
  const effects = t.customEffects as Record<string, unknown> | undefined;
  if (!colors || !typography || !geometry || !effects) return null;

  const keys = ['primary', 'secondary', 'background', 'surface', 'text', 'accent'];
  for (const k of keys) {
    if (!isHex(colors[k])) return null;
  }
  const font = typography.fontStyle;
  if (!['mono', 'serif', 'sans', 'display'].includes(String(font))) return null;
  const radius = geometry.borderRadius;
  if (!['sharp', 'subtle', 'round', 'pill'].includes(String(radius))) return null;
  for (const k of ['glow', 'scanlines', 'glassmorphism']) {
    if (typeof effects[k] !== 'boolean') return null;
  }
  if (typeof t.themeName !== 'string' || !t.themeName.trim()) return null;

  return {
    themeName: String(t.themeName).slice(0, 64),
    colors: {
      primary: colors.primary,
      secondary: colors.secondary,
      background: colors.background,
      surface: colors.surface,
      text: colors.text,
      accent: colors.accent,
    },
    typography: { fontStyle: font },
    geometry: { borderRadius: radius },
    customEffects: {
      glow: effects.glow,
      scanlines: effects.scanlines,
      glassmorphism: effects.glassmorphism,
    },
    // resolved tokens for CSS injection convenience
    css: {
      borderRadius: RADIUS_MAP[String(radius)] || '6px',
    },
  };
}

async function callLLM(vibe: string): Promise<unknown> {
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');

  if (openaiKey) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: Deno.env.get('OPENAI_MODEL') || 'gpt-4o-mini',
        temperature: 0.8,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM },
          {
            role: 'user',
            content: `Vibe description:\n${vibe.slice(0, 800)}`,
          },
        ],
      }),
    });
    if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '{}';
    return JSON.parse(text);
  }

  if (anthropicKey) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: Deno.env.get('ANTHROPIC_MODEL') || 'claude-3-5-haiku-latest',
        max_tokens: 800,
        system: SYSTEM,
        messages: [{ role: 'user', content: `Vibe description:\n${vibe.slice(0, 800)}` }],
      }),
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const text = data.content?.find((b: { type: string }) => b.type === 'text')?.text || '{}';
    const cleaned = text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    return JSON.parse(cleaned);
  }

  throw new Error('No OPENAI_API_KEY or ANTHROPIC_API_KEY configured');
}

Deno.serve(async (req) => {
  const origin = req.headers.get('Origin');
  const headers = corsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'POST only' }), {
      status: 405,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }
    const userId = userData.user.id;

    const body = await req.json().catch(() => ({}));
    const vibe = String(body.vibe || '').trim();
    const reroll = Boolean(body.reroll);
    if (vibe.length < 3) {
      return new Response(JSON.stringify({ error: 'vibe required' }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);
    const { data: profile, error: profErr } = await admin
      .from('profiles')
      .select('theme_config, theme_rerolls_used')
      .eq('id', userId)
      .maybeSingle();

    if (profErr) throw profErr;

    if (profile?.theme_config && !reroll) {
      return new Response(
        JSON.stringify({
          error: 'theme_already_set',
          theme_config: profile.theme_config,
          message: 'Theme already generated. Pass reroll:true to spend a re-roll.',
        }),
        { status: 409, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    }

    const used = profile?.theme_rerolls_used ?? 0;
    if (reroll && profile?.theme_config && used >= MAX_REROLLS) {
      return new Response(JSON.stringify({ error: 'reroll_limit', max: MAX_REROLLS }), {
        status: 429,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    const raw = await callLLM(vibe);
    const theme = validateTheme(raw);
    if (!theme) {
      return new Response(JSON.stringify({ error: 'invalid_theme_from_model', raw }), {
        status: 502,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    const nextRerolls = profile?.theme_config ? used + 1 : used;
    const { data: saved, error: saveErr } = await admin
      .from('profiles')
      .upsert(
        {
          id: userId,
          theme_config: theme,
          theme_generated_at: new Date().toISOString(),
          theme_rerolls_used: nextRerolls,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select('theme_config, theme_generated_at, theme_rerolls_used')
      .single();

    if (saveErr) throw saveErr;

    return new Response(JSON.stringify({ ok: true, ...saved }), {
      status: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String((e as Error).message || e) }), {
      status: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }
});
