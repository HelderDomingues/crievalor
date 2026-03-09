const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/Users/helderdomingues/Documents/GitHub/crievalor/.env' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function checkFKs() {
  const { data, error } = await supabase.rpc('execute_sql', {
    sql_query: `
      SELECT
          tc.table_schema, 
          tc.constraint_name, 
          tc.table_name, 
          kcu.column_name, 
          ccu.table_schema AS foreign_table_schema,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name,
          rc.delete_rule
      FROM 
          information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
          JOIN information_schema.referential_constraints AS rc
            ON tc.constraint_name = rc.constraint_name
      WHERE 
          ccu.table_schema = 'auth' AND ccu.table_name = 'users';
    `
  });

  if (error) {
    console.error('Error fetching FKs:', error);
    
    // Fallback: try doing a direct query if execute_sql doesn't exist
    const { data: d2, error: e2 } = await supabase.from('information_schema.referential_constraints').select('*').limit(1);
    console.log(e2 ? e2.message : 'Fallback query success');
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

checkFKs();
