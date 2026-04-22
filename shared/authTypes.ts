import type { Session, User } from '@supabase/supabase-js'

export interface AuthResponseData {
    user: User | null,
    session: Session | null,
}