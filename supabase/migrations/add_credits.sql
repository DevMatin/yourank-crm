-- 500 Credits für dein Konto hinzufügen (User-ID: f628f37b-6326-4189-a382-3a2ba9751504)
-- Im Supabase SQL Editor ausführen

UPDATE users 
SET credits = credits + 500, 
    updated_at = NOW()
WHERE id = 'f628f37b-6326-4189-a382-3a2ba9751504';

-- Kontrolle: Gutschrift überprüfen
SELECT id, email, credits, updated_at 
FROM users 
WHERE id = 'f628f37b-6326-4189-a382-3a2ba9751504';
