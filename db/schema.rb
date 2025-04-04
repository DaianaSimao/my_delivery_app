# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_04_03_203809) do
  enable_extension "pg_catalog.plpgsql"

  create_table "acompanhamentos", force: :cascade do |t|
    t.string "nome"
    t.integer "quantidade_maxima"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "tipo"
    t.bigint "restaurante_id"
    t.index ["restaurante_id"], name: "index_acompanhamentos_on_restaurante_id"
  end

  create_table "acompanhamentos_adicionais", force: :cascade do |t|
    t.string "nome"
    t.decimal "preco"
    t.string "tipo"
    t.boolean "disponivel"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "acompanhamentos_pedidos", force: :cascade do |t|
    t.bigint "item_acompanhamento_id", null: false
    t.bigint "itens_pedido_id", null: false
    t.integer "quantidade"
    t.decimal "preco_unitario"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_acompanhamento_id"], name: "index_acompanhamentos_pedidos_on_item_acompanhamento_id"
    t.index ["itens_pedido_id"], name: "index_acompanhamentos_pedidos_on_itens_pedido_id"
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "avaliacoes", force: :cascade do |t|
    t.bigint "pedido_id", null: false
    t.decimal "nota", precision: 3, scale: 2, default: "0.0", null: false
    t.text "comentario"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["pedido_id"], name: "index_avaliacoes_on_pedido_id"
  end

  create_table "bairros", force: :cascade do |t|
    t.string "uf"
    t.string "nome"
    t.string "cidade"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "categorias_despesas", force: :cascade do |t|
    t.string "nome", null: false
    t.text "descricao"
    t.boolean "ativo", default: true
    t.bigint "restaurante_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["restaurante_id"], name: "index_categorias_despesas_on_restaurante_id"
  end

  create_table "clientes", force: :cascade do |t|
    t.string "nome"
    t.string "telefone"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "sobrenome"
    t.bigint "endereco_id"
    t.index ["endereco_id"], name: "index_clientes_on_endereco_id"
  end

  create_table "despesas", force: :cascade do |t|
    t.string "descricao", null: false
    t.decimal "valor", precision: 10, scale: 2, null: false
    t.date "data", null: false
    t.string "status", default: "Pendente"
    t.text "observacoes"
    t.bigint "categorias_despesa_id", null: false
    t.bigint "restaurante_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["categorias_despesa_id"], name: "index_despesas_on_categorias_despesa_id"
    t.index ["restaurante_id"], name: "index_despesas_on_restaurante_id"
  end

  create_table "enderecos", force: :cascade do |t|
    t.string "rua"
    t.string "numero"
    t.string "complemento"
    t.string "bairro"
    t.string "cidade"
    t.string "estado"
    t.string "cep"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "tipo"
    t.string "ponto_referencia"
    t.bigint "regioes_entrega_id"
    t.string "uf"
    t.index ["regioes_entrega_id"], name: "index_enderecos_on_regioes_entrega_id"
  end

  create_table "entregadores", force: :cascade do |t|
    t.string "nome", null: false
    t.string "telefone", null: false
    t.string "veiculo"
    t.boolean "ativo", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "restaurante_id"
    t.string "placa"
    t.index ["restaurante_id"], name: "index_entregadores_on_restaurante_id"
  end

  create_table "entregas", force: :cascade do |t|
    t.bigint "pedido_id", null: false
    t.bigint "entregador_id"
    t.string "status", default: "Aguardando"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "taxa_entrega"
    t.index ["entregador_id"], name: "index_entregas_on_entregador_id"
    t.index ["pedido_id"], name: "index_entregas_on_pedido_id"
  end

  create_table "horario_funcionamentos", force: :cascade do |t|
    t.bigint "restaurante_id", null: false
    t.string "dia_semana", null: false
    t.time "abertura", null: false
    t.time "fechamento", null: false
    t.boolean "ativo", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["restaurante_id"], name: "index_horario_funcionamentos_on_restaurante_id"
  end

  create_table "item_acompanhamentos", force: :cascade do |t|
    t.string "nome"
    t.decimal "preco"
    t.bigint "acompanhamento_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["acompanhamento_id"], name: "index_item_acompanhamentos_on_acompanhamento_id"
  end

  create_table "itens_pedidos", force: :cascade do |t|
    t.bigint "pedido_id", null: false
    t.bigint "produto_id", null: false
    t.integer "quantidade", default: 1, null: false
    t.decimal "preco_unitario", precision: 10, scale: 2, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "observacao"
    t.index ["pedido_id"], name: "index_itens_pedidos_on_pedido_id"
    t.index ["produto_id"], name: "index_itens_pedidos_on_produto_id"
  end

  create_table "jwt_denylists", force: :cascade do |t|
    t.string "jti"
    t.datetime "exp"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["jti"], name: "index_jwt_denylists_on_jti"
  end

  create_table "pagamentos", force: :cascade do |t|
    t.bigint "pedido_id", null: false
    t.string "metodo"
    t.string "status", default: "Pendente"
    t.decimal "valor", precision: 10, scale: 2, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "troco", precision: 10, scale: 2
    t.index ["pedido_id"], name: "index_pagamentos_on_pedido_id"
  end

  create_table "pedidos", force: :cascade do |t|
    t.bigint "restaurante_id", null: false
    t.string "status", default: "Recebido"
    t.string "forma_pagamento"
    t.decimal "troco_para", precision: 10, scale: 2, default: "0.0"
    t.decimal "valor_total", precision: 10, scale: 2, null: false
    t.text "observacoes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "cliente_id", null: false
    t.string "forma_entrega"
    t.decimal "taxa_entrega", precision: 10, scale: 2, default: "0.0"
    t.index ["cliente_id"], name: "index_pedidos_on_cliente_id"
    t.index ["restaurante_id"], name: "index_pedidos_on_restaurante_id"
  end

  create_table "produto_acompanhamentos", force: :cascade do |t|
    t.bigint "produto_id", null: false
    t.bigint "acompanhamento_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["acompanhamento_id"], name: "index_produto_acompanhamentos_on_acompanhamento_id"
    t.index ["produto_id"], name: "index_produto_acompanhamentos_on_produto_id"
  end

  create_table "produto_secoes", force: :cascade do |t|
    t.bigint "produto_id", null: false
    t.bigint "secoes_cardapio_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["produto_id"], name: "index_produto_secoes_on_produto_id"
    t.index ["secoes_cardapio_id"], name: "index_produto_secoes_on_secoes_cardapio_id"
  end

  create_table "produtos", force: :cascade do |t|
    t.bigint "restaurante_id", null: false
    t.string "nome", null: false
    t.text "descricao"
    t.decimal "preco", precision: 10, scale: 2, null: false
    t.string "imagem_url"
    t.boolean "disponivel", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["restaurante_id"], name: "index_produtos_on_restaurante_id"
  end

  create_table "promocoes", force: :cascade do |t|
    t.string "nome"
    t.text "descricao"
    t.string "tipo"
    t.decimal "valor_de"
    t.decimal "valor_para"
    t.decimal "desconto_percentual"
    t.date "data_inicio"
    t.date "data_fim"
    t.boolean "ativa"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "restaurante_id"
  end

  create_table "promocoes_produtos", force: :cascade do |t|
    t.bigint "promocao_id", null: false
    t.bigint "produto_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["produto_id"], name: "index_promocoes_produtos_on_produto_id"
    t.index ["promocao_id"], name: "index_promocoes_produtos_on_promocao_id"
  end

  create_table "regioes_entregas", force: :cascade do |t|
    t.integer "restaurante_id"
    t.string "bairro"
    t.decimal "taxa_entrega"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "ativo"
    t.string "cidade"
  end

  create_table "restaurantes", force: :cascade do |t|
    t.string "nome", null: false
    t.text "descricao"
    t.string "categoria"
    t.decimal "taxa_entrega", precision: 10, scale: 2, default: "0.0"
    t.integer "tempo_medio_entrega"
    t.decimal "avaliacao", precision: 3, scale: 2, default: "0.0"
    t.boolean "ativo", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "endereco_id"
    t.time "abertura"
    t.time "fechamento"
    t.string "cnpj"
    t.string "telefone"
    t.string "email"
    t.string "dias_funcionamento"
    t.decimal "pedido_minimo"
    t.index ["endereco_id"], name: "index_restaurantes_on_endereco_id"
  end

  create_table "secoes_cardapios", force: :cascade do |t|
    t.string "nome"
    t.bigint "restaurante_id", null: false
    t.string "ordem"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["restaurante_id"], name: "index_secoes_cardapios_on_restaurante_id"
  end

  create_table "solid_queue_blocked_executions", force: :cascade do |t|
    t.bigint "job_id", null: false
    t.string "queue_name", null: false
    t.integer "priority", default: 0, null: false
    t.string "concurrency_key", null: false
    t.datetime "expires_at", null: false
    t.datetime "created_at", null: false
    t.index ["concurrency_key", "priority", "job_id"], name: "index_solid_queue_blocked_executions_for_release"
    t.index ["expires_at", "concurrency_key"], name: "index_solid_queue_blocked_executions_for_maintenance"
    t.index ["job_id"], name: "index_solid_queue_blocked_executions_on_job_id", unique: true
  end

  create_table "solid_queue_claimed_executions", force: :cascade do |t|
    t.bigint "job_id", null: false
    t.bigint "process_id"
    t.datetime "created_at", null: false
    t.index ["job_id"], name: "index_solid_queue_claimed_executions_on_job_id", unique: true
    t.index ["process_id", "job_id"], name: "index_solid_queue_claimed_executions_on_process_id_and_job_id"
  end

  create_table "solid_queue_failed_executions", force: :cascade do |t|
    t.bigint "job_id", null: false
    t.text "error"
    t.datetime "created_at", null: false
    t.index ["job_id"], name: "index_solid_queue_failed_executions_on_job_id", unique: true
  end

  create_table "solid_queue_jobs", force: :cascade do |t|
    t.string "queue_name", null: false
    t.string "class_name", null: false
    t.text "arguments"
    t.integer "priority", default: 0, null: false
    t.string "active_job_id"
    t.datetime "scheduled_at"
    t.datetime "finished_at"
    t.string "concurrency_key"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active_job_id"], name: "index_solid_queue_jobs_on_active_job_id"
    t.index ["class_name"], name: "index_solid_queue_jobs_on_class_name"
    t.index ["finished_at"], name: "index_solid_queue_jobs_on_finished_at"
    t.index ["queue_name", "finished_at"], name: "index_solid_queue_jobs_for_filtering"
    t.index ["scheduled_at", "finished_at"], name: "index_solid_queue_jobs_for_alerting"
  end

  create_table "solid_queue_pauses", force: :cascade do |t|
    t.string "queue_name", null: false
    t.datetime "created_at", null: false
    t.index ["queue_name"], name: "index_solid_queue_pauses_on_queue_name", unique: true
  end

  create_table "solid_queue_processes", force: :cascade do |t|
    t.string "kind", null: false
    t.datetime "last_heartbeat_at", null: false
    t.bigint "supervisor_id"
    t.integer "pid", null: false
    t.string "hostname"
    t.text "metadata"
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.index ["last_heartbeat_at"], name: "index_solid_queue_processes_on_last_heartbeat_at"
    t.index ["name", "supervisor_id"], name: "index_solid_queue_processes_on_name_and_supervisor_id", unique: true
    t.index ["supervisor_id"], name: "index_solid_queue_processes_on_supervisor_id"
  end

  create_table "solid_queue_ready_executions", force: :cascade do |t|
    t.bigint "job_id", null: false
    t.string "queue_name", null: false
    t.integer "priority", default: 0, null: false
    t.datetime "created_at", null: false
    t.index ["job_id"], name: "index_solid_queue_ready_executions_on_job_id", unique: true
    t.index ["priority", "job_id"], name: "index_solid_queue_poll_all"
    t.index ["queue_name", "priority", "job_id"], name: "index_solid_queue_poll_by_queue"
  end

  create_table "solid_queue_recurring_executions", force: :cascade do |t|
    t.bigint "job_id", null: false
    t.string "task_key", null: false
    t.datetime "run_at", null: false
    t.datetime "created_at", null: false
    t.index ["job_id"], name: "index_solid_queue_recurring_executions_on_job_id", unique: true
    t.index ["task_key", "run_at"], name: "index_solid_queue_recurring_executions_on_task_key_and_run_at", unique: true
  end

  create_table "solid_queue_recurring_tasks", force: :cascade do |t|
    t.string "key", null: false
    t.string "schedule", null: false
    t.string "command", limit: 2048
    t.string "class_name"
    t.text "arguments"
    t.string "queue_name"
    t.integer "priority", default: 0
    t.boolean "static", default: true, null: false
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["key"], name: "index_solid_queue_recurring_tasks_on_key", unique: true
    t.index ["static"], name: "index_solid_queue_recurring_tasks_on_static"
  end

  create_table "solid_queue_scheduled_executions", force: :cascade do |t|
    t.bigint "job_id", null: false
    t.string "queue_name", null: false
    t.integer "priority", default: 0, null: false
    t.datetime "scheduled_at", null: false
    t.datetime "created_at", null: false
    t.index ["job_id"], name: "index_solid_queue_scheduled_executions_on_job_id", unique: true
    t.index ["scheduled_at", "priority", "job_id"], name: "index_solid_queue_dispatch_all"
  end

  create_table "solid_queue_semaphores", force: :cascade do |t|
    t.string "key", null: false
    t.integer "value", default: 1, null: false
    t.datetime "expires_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["expires_at"], name: "index_solid_queue_semaphores_on_expires_at"
    t.index ["key", "value"], name: "index_solid_queue_semaphores_on_key_and_value"
    t.index ["key"], name: "index_solid_queue_semaphores_on_key", unique: true
  end

  create_table "user_restaurantes", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "restaurante_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["restaurante_id"], name: "index_user_restaurantes_on_restaurante_id"
    t.index ["user_id"], name: "index_user_restaurantes_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "jti"
    t.integer "restaurante_ativo"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "acompanhamentos", "restaurantes"
  add_foreign_key "acompanhamentos_pedidos", "item_acompanhamentos"
  add_foreign_key "acompanhamentos_pedidos", "itens_pedidos"
  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "avaliacoes", "pedidos"
  add_foreign_key "categorias_despesas", "restaurantes"
  add_foreign_key "clientes", "enderecos"
  add_foreign_key "despesas", "categorias_despesas"
  add_foreign_key "despesas", "restaurantes"
  add_foreign_key "enderecos", "regioes_entregas"
  add_foreign_key "entregadores", "restaurantes"
  add_foreign_key "entregas", "entregadores"
  add_foreign_key "entregas", "pedidos"
  add_foreign_key "horario_funcionamentos", "restaurantes"
  add_foreign_key "item_acompanhamentos", "acompanhamentos"
  add_foreign_key "itens_pedidos", "pedidos"
  add_foreign_key "itens_pedidos", "produtos"
  add_foreign_key "pagamentos", "pedidos"
  add_foreign_key "pedidos", "clientes"
  add_foreign_key "pedidos", "restaurantes"
  add_foreign_key "produto_acompanhamentos", "acompanhamentos"
  add_foreign_key "produto_acompanhamentos", "produtos"
  add_foreign_key "produto_secoes", "produtos"
  add_foreign_key "produto_secoes", "secoes_cardapios"
  add_foreign_key "produtos", "restaurantes"
  add_foreign_key "promocoes_produtos", "produtos"
  add_foreign_key "promocoes_produtos", "promocoes"
  add_foreign_key "restaurantes", "enderecos"
  add_foreign_key "secoes_cardapios", "restaurantes"
  add_foreign_key "solid_queue_blocked_executions", "solid_queue_jobs", column: "job_id", on_delete: :cascade
  add_foreign_key "solid_queue_claimed_executions", "solid_queue_jobs", column: "job_id", on_delete: :cascade
  add_foreign_key "solid_queue_failed_executions", "solid_queue_jobs", column: "job_id", on_delete: :cascade
  add_foreign_key "solid_queue_ready_executions", "solid_queue_jobs", column: "job_id", on_delete: :cascade
  add_foreign_key "solid_queue_recurring_executions", "solid_queue_jobs", column: "job_id", on_delete: :cascade
  add_foreign_key "solid_queue_scheduled_executions", "solid_queue_jobs", column: "job_id", on_delete: :cascade
  add_foreign_key "user_restaurantes", "restaurantes"
  add_foreign_key "user_restaurantes", "users"
end
