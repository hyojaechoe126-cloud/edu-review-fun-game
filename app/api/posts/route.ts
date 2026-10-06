import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured, INITIAL_POSTS, Post } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ source: 'supabase', data });
      }
    } catch (e) {
      console.error('Error fetching posts from Supabase:', e);
    }
  }

  return NextResponse.json({ source: 'mockup', data: INITIAL_POSTS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, id, title, content, author } = body;

    // Handle Like action
    if (action === 'like' && id) {
      if (isSupabaseConfigured && supabase) {
        // Fetch current likes then increment
        const { data: current } = await supabase.from('posts').select('likes').eq('id', id).single();
        if (current) {
          const { data, error } = await supabase
            .from('posts')
            .update({ likes: (current.likes || 0) + 1 })
            .eq('id', id)
            .select()
            .single();

          if (!error && data) {
            return NextResponse.json({ success: true, source: 'supabase', data });
          }
        }
      }
      return NextResponse.json({ success: true, source: 'local', id, likesDelta: 1 });
    }

    // Handle New Post creation
    if (!title || !content || !author) {
      return NextResponse.json({ error: 'Missing title, content, or author' }, { status: 400 });
    }

    const created_at = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('posts')
        .insert([{ title, content, author, created_at, likes: 0 }])
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ success: true, source: 'supabase', data });
      }
    }

    const newPost: Post = {
      id: Date.now(),
      title,
      content,
      author,
      created_at,
      likes: 0,
    };

    return NextResponse.json({ success: true, source: 'local', data: newPost });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
