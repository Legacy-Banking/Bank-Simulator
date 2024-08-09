import { createClient } from '@/utils/supabase/server';

export default async function Notes() {
    const supabase = createClient();
    const { data: notes } = await supabase.from("notes").select("content");


    return (notes || []).map((note: any) => (
        <div key={note.id} className="bg-foreground/5 p-4 rounded-md my-4">
            <p>{note.content}</p>
        </div>
    ));
}