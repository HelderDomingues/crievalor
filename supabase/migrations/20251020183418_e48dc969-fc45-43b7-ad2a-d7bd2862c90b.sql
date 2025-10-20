-- Inserir os logos de clientes que já estão sendo usados no site
INSERT INTO public.client_logos (name, logo) VALUES
  ('Cliente 1', 'https://static.wixstatic.com/media/783feb_5c9ff869c87f45a0ae9a1913ba11671d~mv2.png'),
  ('Cliente 2', 'https://static.wixstatic.com/media/783feb_b67b99dff06b4cd4b4c3f4e97f254a1c~mv2.png'),
  ('Cliente 3', 'https://static.wixstatic.com/media/783feb_1ba035c02bef475eb478ae3b97442317~mv2.png'),
  ('Cliente 4', 'https://static.wixstatic.com/media/783feb_ea430c1167fa4139b4d7ff59c8eb25fc~mv2.png'),
  ('Cliente 5', 'https://static.wixstatic.com/media/783feb_18e1bf2634294ef2875a05c90eeb9ed1~mv2.png'),
  ('Cliente 6', 'https://static.wixstatic.com/media/783feb_913ab1cf3d824988bd6a3080105d29ff~mv2.png'),
  ('Cliente 7', 'https://static.wixstatic.com/media/783feb_fca6dddfe0fe402eb49b75a46638574a~mv2.png'),
  ('Cliente 8', 'https://static.wixstatic.com/media/783feb_df6fab1edd1f4510a4ed7a384be621f9~mv2.png')
ON CONFLICT DO NOTHING;