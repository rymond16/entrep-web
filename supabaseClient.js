import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tavldeepnprrelmkmeqt.supabase.co/rest/v1/'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhdmxkZWVwbnBycmVsbWttZXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NjQ4OTYsImV4cCI6MjA5MjQ0MDg5Nn0.Csw1Mmtb94OU_MMfHhBC0XkQUZBjoiARCLoRsXItkHk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)