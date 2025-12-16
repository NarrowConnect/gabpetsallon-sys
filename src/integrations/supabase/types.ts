export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      agendamentos: {
        Row: {
          created_at: string | null
          data_servico: string
          hora_servico: string
          id: string
          observacoes: string | null
          origem: string | null
          pet_id: string | null
          pet_nome: string
          pet_porte: string | null
          pet_raca: string | null
          servico: string
          status: string | null
          tutor_id: string | null
          tutor_nome: string
          tutor_telefone: string | null
          updated_at: string | null
          valor: number | null
        }
        Insert: {
          created_at?: string | null
          data_servico: string
          hora_servico: string
          id?: string
          observacoes?: string | null
          origem?: string | null
          pet_id?: string | null
          pet_nome: string
          pet_porte?: string | null
          pet_raca?: string | null
          servico: string
          status?: string | null
          tutor_id?: string | null
          tutor_nome: string
          tutor_telefone?: string | null
          updated_at?: string | null
          valor?: number | null
        }
        Update: {
          created_at?: string | null
          data_servico?: string
          hora_servico?: string
          id?: string
          observacoes?: string | null
          origem?: string | null
          pet_id?: string | null
          pet_nome?: string
          pet_porte?: string | null
          pet_raca?: string | null
          servico?: string
          status?: string | null
          tutor_id?: string | null
          tutor_nome?: string
          tutor_telefone?: string | null
          updated_at?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutores"
            referencedColumns: ["id"]
          },
        ]
      }
      agendamentos_tutores: {
        Row: {
          created_at: string | null
          data_resposta: string | null
          data_servico: string
          hora_servico: string
          id: string
          observacoes: string | null
          observacoes_admin: string | null
          pet_nome: string
          pet_porte: string | null
          pet_raca: string | null
          servico: string
          status: string | null
          tutor_nome: string
          tutor_telefone: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_resposta?: string | null
          data_servico: string
          hora_servico: string
          id?: string
          observacoes?: string | null
          observacoes_admin?: string | null
          pet_nome: string
          pet_porte?: string | null
          pet_raca?: string | null
          servico: string
          status?: string | null
          tutor_nome: string
          tutor_telefone: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_resposta?: string | null
          data_servico?: string
          hora_servico?: string
          id?: string
          observacoes?: string | null
          observacoes_admin?: string | null
          pet_nome?: string
          pet_porte?: string | null
          pet_raca?: string | null
          servico?: string
          status?: string | null
          tutor_nome?: string
          tutor_telefone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contas_a_pagar: {
        Row: {
          aluguel: number | null
          banhista: number | null
          boleto_biocom: number | null
          boleto_euroshop: number | null
          cartao_bb: number | null
          cartao_gab: number | null
          cartao_nu: number | null
          cartao_santander: number | null
          celular_mes: number | null
          copel: number | null
          created_at: string | null
          gasolina: number | null
          id: string
          internet: number | null
          mei: number | null
          mes_referencia: string
          publicidade: number | null
          sanepar: number | null
          seguranca_mensalidade: number | null
          tarifa_bancaria: number | null
          toalhas: number | null
          total_saidas: number | null
          updated_at: string | null
        }
        Insert: {
          aluguel?: number | null
          banhista?: number | null
          boleto_biocom?: number | null
          boleto_euroshop?: number | null
          cartao_bb?: number | null
          cartao_gab?: number | null
          cartao_nu?: number | null
          cartao_santander?: number | null
          celular_mes?: number | null
          copel?: number | null
          created_at?: string | null
          gasolina?: number | null
          id?: string
          internet?: number | null
          mei?: number | null
          mes_referencia: string
          publicidade?: number | null
          sanepar?: number | null
          seguranca_mensalidade?: number | null
          tarifa_bancaria?: number | null
          toalhas?: number | null
          total_saidas?: number | null
          updated_at?: string | null
        }
        Update: {
          aluguel?: number | null
          banhista?: number | null
          boleto_biocom?: number | null
          boleto_euroshop?: number | null
          cartao_bb?: number | null
          cartao_gab?: number | null
          cartao_nu?: number | null
          cartao_santander?: number | null
          celular_mes?: number | null
          copel?: number | null
          created_at?: string | null
          gasolina?: number | null
          id?: string
          internet?: number | null
          mei?: number | null
          mes_referencia?: string
          publicidade?: number | null
          sanepar?: number | null
          seguranca_mensalidade?: number | null
          tarifa_bancaria?: number | null
          toalhas?: number | null
          total_saidas?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      controle_financeiro: {
        Row: {
          created_at: string | null
          id: string
          mes_referencia: string
          saldo_anterior: number | null
          saldo_atual: number | null
          saldo_transportar: number | null
          total_entradas: number | null
          total_saidas: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          mes_referencia: string
          saldo_anterior?: number | null
          saldo_atual?: number | null
          saldo_transportar?: number | null
          total_entradas?: number | null
          total_saidas?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          mes_referencia?: string
          saldo_anterior?: number | null
          saldo_atual?: number | null
          saldo_transportar?: number | null
          total_entradas?: number | null
          total_saidas?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      creche_agendamentos: {
        Row: {
          created_at: string | null
          data_entrada: string
          data_saida: string | null
          id: string
          observacoes: string | null
          pet_id: string | null
          pet_nome: string
          status: string | null
          tutor_nome: string
          tutor_telefone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_entrada: string
          data_saida?: string | null
          id?: string
          observacoes?: string | null
          pet_id?: string | null
          pet_nome: string
          status?: string | null
          tutor_nome: string
          tutor_telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_entrada?: string
          data_saida?: string | null
          id?: string
          observacoes?: string | null
          pet_id?: string | null
          pet_nome?: string
          status?: string | null
          tutor_nome?: string
          tutor_telefone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creche_agendamentos_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      creche_documentos: {
        Row: {
          created_at: string | null
          creche_agendamento_id: string | null
          id: string
          nome_arquivo: string
          pet_id: string | null
          public_token: string | null
          tipo_arquivo: string
          url_arquivo: string
        }
        Insert: {
          created_at?: string | null
          creche_agendamento_id?: string | null
          id?: string
          nome_arquivo: string
          pet_id?: string | null
          public_token?: string | null
          tipo_arquivo: string
          url_arquivo: string
        }
        Update: {
          created_at?: string | null
          creche_agendamento_id?: string | null
          id?: string
          nome_arquivo?: string
          pet_id?: string | null
          public_token?: string | null
          tipo_arquivo?: string
          url_arquivo?: string
        }
        Relationships: [
          {
            foreignKeyName: "creche_documentos_creche_agendamento_id_fkey"
            columns: ["creche_agendamento_id"]
            isOneToOne: false
            referencedRelation: "creche_agendamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creche_documentos_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      despesas_personalizadas: {
        Row: {
          created_at: string | null
          data_despesa: string | null
          descricao: string
          id: string
          mes_referencia: string
          valor: number
        }
        Insert: {
          created_at?: string | null
          data_despesa?: string | null
          descricao: string
          id?: string
          mes_referencia: string
          valor: number
        }
        Update: {
          created_at?: string | null
          data_despesa?: string | null
          descricao?: string
          id?: string
          mes_referencia?: string
          valor?: number
        }
        Relationships: []
      }
      pets: {
        Row: {
          castrado: boolean | null
          celular_veterinario: string | null
          cidade_veterinario: string | null
          controle_parasitario: string | null
          created_at: string | null
          data_aniversario: string | null
          endereco_veterinario: string | null
          especie: string | null
          estado_veterinario: string | null
          id: string
          idade: number | null
          medicamentos: string | null
          necessidades_especiais: string | null
          nome_pet: string
          nome_tutor: string
          nome_veterinario: string | null
          peso: number | null
          porte: string | null
          raca: string | null
          rotina: string | null
          saude: string | null
          sexo: string | null
          telefone_veterinario: string | null
          temperamento: string | null
          toma_medicamentos: boolean | null
          tutor_id: string | null
          updated_at: string | null
          vacinas_vermifugos: string | null
        }
        Insert: {
          castrado?: boolean | null
          celular_veterinario?: string | null
          cidade_veterinario?: string | null
          controle_parasitario?: string | null
          created_at?: string | null
          data_aniversario?: string | null
          endereco_veterinario?: string | null
          especie?: string | null
          estado_veterinario?: string | null
          id?: string
          idade?: number | null
          medicamentos?: string | null
          necessidades_especiais?: string | null
          nome_pet: string
          nome_tutor: string
          nome_veterinario?: string | null
          peso?: number | null
          porte?: string | null
          raca?: string | null
          rotina?: string | null
          saude?: string | null
          sexo?: string | null
          telefone_veterinario?: string | null
          temperamento?: string | null
          toma_medicamentos?: boolean | null
          tutor_id?: string | null
          updated_at?: string | null
          vacinas_vermifugos?: string | null
        }
        Update: {
          castrado?: boolean | null
          celular_veterinario?: string | null
          cidade_veterinario?: string | null
          controle_parasitario?: string | null
          created_at?: string | null
          data_aniversario?: string | null
          endereco_veterinario?: string | null
          especie?: string | null
          estado_veterinario?: string | null
          id?: string
          idade?: number | null
          medicamentos?: string | null
          necessidades_especiais?: string | null
          nome_pet?: string
          nome_tutor?: string
          nome_veterinario?: string | null
          peso?: number | null
          porte?: string | null
          raca?: string | null
          rotina?: string | null
          saude?: string | null
          sexo?: string | null
          telefone_veterinario?: string | null
          temperamento?: string | null
          toma_medicamentos?: boolean | null
          tutor_id?: string | null
          updated_at?: string | null
          vacinas_vermifugos?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pets_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutores"
            referencedColumns: ["id"]
          },
        ]
      }
      receitas_personalizadas: {
        Row: {
          created_at: string | null
          data_receita: string | null
          descricao: string
          id: string
          mes_referencia: string
          valor: number
        }
        Insert: {
          created_at?: string | null
          data_receita?: string | null
          descricao: string
          id?: string
          mes_referencia: string
          valor: number
        }
        Update: {
          created_at?: string | null
          data_receita?: string | null
          descricao?: string
          id?: string
          mes_referencia?: string
          valor?: number
        }
        Relationships: []
      }
      teste: {
        Row: {
          algo: string | null
          created_at: string
          id: number
        }
        Insert: {
          algo?: string | null
          created_at?: string
          id?: number
        }
        Update: {
          algo?: string | null
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      tutores: {
        Row: {
          celular: string
          celular_veterinario: string | null
          cep: string | null
          cidade: string | null
          cidade_veterinario: string | null
          contato_adicional_1_nome: string | null
          contato_adicional_1_telefone: string | null
          contato_adicional_2_nome: string | null
          contato_adicional_2_telefone: string | null
          created_at: string | null
          email: string | null
          endereco: string | null
          endereco_veterinario: string | null
          estado: string | null
          estado_veterinario: string | null
          id: string
          nome: string
          nome_veterinario: string | null
          telefone_residencial: string | null
          telefone_veterinario: string | null
          updated_at: string | null
        }
        Insert: {
          celular: string
          celular_veterinario?: string | null
          cep?: string | null
          cidade?: string | null
          cidade_veterinario?: string | null
          contato_adicional_1_nome?: string | null
          contato_adicional_1_telefone?: string | null
          contato_adicional_2_nome?: string | null
          contato_adicional_2_telefone?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          endereco_veterinario?: string | null
          estado?: string | null
          estado_veterinario?: string | null
          id?: string
          nome: string
          nome_veterinario?: string | null
          telefone_residencial?: string | null
          telefone_veterinario?: string | null
          updated_at?: string | null
        }
        Update: {
          celular?: string
          celular_veterinario?: string | null
          cep?: string | null
          cidade?: string | null
          cidade_veterinario?: string | null
          contato_adicional_1_nome?: string | null
          contato_adicional_1_telefone?: string | null
          contato_adicional_2_nome?: string | null
          contato_adicional_2_telefone?: string | null
          created_at?: string | null
          email?: string | null
          endereco?: string | null
          endereco_veterinario?: string | null
          estado?: string | null
          estado_veterinario?: string | null
          id?: string
          nome?: string
          nome_veterinario?: string | null
          telefone_residencial?: string | null
          telefone_veterinario?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      usuarios_admin: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          email: string
          id: string
          nome: string
          senha_hash: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          email: string
          id?: string
          nome: string
          senha_hash: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          senha_hash?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      valores_recebidos: {
        Row: {
          banho_porte_medio: number | null
          banhos_medicamentosos: number | null
          banhos_porte_grande: number | null
          banhos_porte_pequeno: number | null
          boutique: number | null
          created_at: string | null
          creche: number | null
          hospedagens: number | null
          id: string
          mes_referencia: string
          taxi_dog: number | null
          tosas: number | null
          total_entradas: number | null
          updated_at: string | null
        }
        Insert: {
          banho_porte_medio?: number | null
          banhos_medicamentosos?: number | null
          banhos_porte_grande?: number | null
          banhos_porte_pequeno?: number | null
          boutique?: number | null
          created_at?: string | null
          creche?: number | null
          hospedagens?: number | null
          id?: string
          mes_referencia: string
          taxi_dog?: number | null
          tosas?: number | null
          total_entradas?: number | null
          updated_at?: string | null
        }
        Update: {
          banho_porte_medio?: number | null
          banhos_medicamentosos?: number | null
          banhos_porte_grande?: number | null
          banhos_porte_pequeno?: number | null
          boutique?: number | null
          created_at?: string | null
          creche?: number | null
          hospedagens?: number | null
          id?: string
          mes_referencia?: string
          taxi_dog?: number | null
          tosas?: number | null
          total_entradas?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      webhook_configurations: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          is_active: boolean | null
          secret_key: string | null
          updated_at: string | null
          webhook_url: string
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          is_active?: boolean | null
          secret_key?: string | null
          updated_at?: string | null
          webhook_url: string
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          is_active?: boolean | null
          secret_key?: string | null
          updated_at?: string | null
          webhook_url?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          error_message: string | null
          event_data: Json | null
          event_type: string
          http_status: number | null
          id: string
          response_body: string | null
          sent_at: string | null
          webhook_config_id: string | null
          webhook_url: string
        }
        Insert: {
          error_message?: string | null
          event_data?: Json | null
          event_type: string
          http_status?: number | null
          id?: string
          response_body?: string | null
          sent_at?: string | null
          webhook_config_id?: string | null
          webhook_url: string
        }
        Update: {
          error_message?: string | null
          event_data?: Json | null
          event_type?: string
          http_status?: number | null
          id?: string
          response_body?: string | null
          sent_at?: string | null
          webhook_config_id?: string | null
          webhook_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_logs_webhook_config_id_fkey"
            columns: ["webhook_config_id"]
            isOneToOne: false
            referencedRelation: "webhook_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      trigger_webhook: {
        Args: { p_event_data: Json; p_event_type: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
