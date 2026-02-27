insert into procedure_catalog (name, category, description, default_duration_min, default_price, facial_regions)
values
  ('Toxina Botulínica', 'Toxina', 'Aplicação por regiões faciais com acompanhamento de retorno.', 30, 900.00, '["frontal", "glabela", "periocular"]'::jsonb),
  ('Preenchimento com Ácido Hialurônico', 'Preenchimento', 'Preenchimento de lábios, malar, mandíbula, mento e sulco.', 45, 1800.00, '["lábios", "malar", "mandíbula", "mento", "sulco nasogeniano"]'::jsonb),
  ('Bioestimulador de Colágeno', 'Bioestimulador', 'Sculptra e Radiesse para melhora de firmeza e volume.', 50, 2200.00, '["malar", "mandíbula", "têmporas"]'::jsonb),
  ('Fios de PDO', 'Fios', 'Fios de sustentação e estímulo de colágeno.', 60, 2500.00, '["terço médio", "mandíbula", "submento"]'::jsonb),
  ('Skinbooster', 'Injetável', 'Hidratação profunda e melhora de textura.', 35, 1200.00, '["face", "pescoço"]'::jsonb),
  ('Lipo enzimática de papada', 'Enzimático', 'Aplicação para submento com protocolo seriado.', 30, 700.00, '["submento"]'::jsonb),
  ('Peeling químico', 'Peeling', 'Peeling químico supervisionado.', 40, 600.00, '["face"]'::jsonb),
  ('Microagulhamento', 'Microagulhamento', 'Microagulhamento com ou sem drug delivery.', 45, 850.00, '["face", "pescoço"]'::jsonb)
on conflict do nothing;

insert into document_templates (name, type, content_html)
values
  ('Termo de Consentimento - Harmonização Facial', 'consent', '<h1>Termo de Consentimento</h1><p>Paciente declara ciência dos riscos e benefícios...</p>'),
  ('Modelo de Orçamento', 'estimate', '<h1>Orçamento</h1><p>Paciente: {{patient_name}}</p>'),
  ('Modelo de Recibo', 'receipt', '<h1>Recibo</h1><p>Valor recebido: {{amount}}</p>')
on conflict do nothing;
