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

ActiveRecord::Schema[8.0].define(version: 2025_02_04_020855) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "avaliacoes", force: :cascade do |t|
    t.bigint "pedido_id", null: false
    t.decimal "nota", precision: 3, scale: 2, default: "0.0", null: false
    t.text "comentario"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["pedido_id"], name: "index_avaliacoes_on_pedido_id"
  end

  create_table "clientes", force: :cascade do |t|
    t.string "nome"
    t.string "telefone"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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
  end

  create_table "entregadores", force: :cascade do |t|
    t.string "nome", null: false
    t.string "telefone", null: false
    t.string "veiculo"
    t.boolean "ativo", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "entregas", force: :cascade do |t|
    t.bigint "pedido_id", null: false
    t.bigint "entregador_id"
    t.string "status", default: "Aguardando"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["entregador_id"], name: "index_entregas_on_entregador_id"
    t.index ["pedido_id"], name: "index_entregas_on_pedido_id"
  end

  create_table "itens_pedidos", force: :cascade do |t|
    t.bigint "pedido_id", null: false
    t.bigint "produto_id", null: false
    t.integer "quantidade", default: 1, null: false
    t.decimal "preco_unitario", precision: 10, scale: 2, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["pedido_id"], name: "index_itens_pedidos_on_pedido_id"
    t.index ["produto_id"], name: "index_itens_pedidos_on_produto_id"
  end

  create_table "pagamentos", force: :cascade do |t|
    t.bigint "pedido_id", null: false
    t.string "metodo"
    t.string "status", default: "Pendente"
    t.decimal "valor", precision: 10, scale: 2, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["pedido_id"], name: "index_pagamentos_on_pedido_id"
  end

  create_table "pedidos", force: :cascade do |t|
    t.bigint "restaurante_id", null: false
    t.string "status", default: "Recebido"
    t.string "forma_pagamento"
    t.decimal "troco", precision: 10, scale: 2, default: "0.0"
    t.decimal "valor_total", precision: 10, scale: 2, null: false
    t.text "observacoes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "cliente_id", null: false
    t.bigint "endereco_id"
    t.index ["cliente_id"], name: "index_pedidos_on_cliente_id"
    t.index ["endereco_id"], name: "index_pedidos_on_endereco_id"
    t.index ["restaurante_id"], name: "index_pedidos_on_restaurante_id"
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
    t.index ["endereco_id"], name: "index_restaurantes_on_endereco_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "avaliacoes", "pedidos"
  add_foreign_key "entregas", "entregadores"
  add_foreign_key "entregas", "pedidos"
  add_foreign_key "itens_pedidos", "pedidos"
  add_foreign_key "itens_pedidos", "produtos"
  add_foreign_key "pagamentos", "pedidos"
  add_foreign_key "pedidos", "clientes"
  add_foreign_key "pedidos", "enderecos"
  add_foreign_key "pedidos", "restaurantes"
  add_foreign_key "produtos", "restaurantes"
  add_foreign_key "restaurantes", "enderecos"
end
