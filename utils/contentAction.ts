import { createClient } from "./supabase/client";

export const contentAction = {
  async fetchEmbedding(pageKey: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('content_embeddings')
      .select('key, content') 
      .eq('page_key', pageKey);

    if (error) {
      throw error;
    }
    console.log(data);
    const result = (data || []).reduce((acc: Record<string, string>, item: { key: string, content: string }) => {
      acc[item.key] = item.content;
      return acc;
    }, {});

    return result;
  },
};
