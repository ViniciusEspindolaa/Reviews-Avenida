"use client";
import React, { useEffect } from "react";
import { UsuarioItf } from "../utils/types/UsuarioItf";
import { create } from "zustand";

type UsuarioStore = {
  usuario: UsuarioItf | null;
  logaUsuario: (usuarioLogado: UsuarioItf) => void;
  deslogaUsuario: () => void;
};

export const useUsuarioStore = create<UsuarioStore>((set) => ({
  usuario: null,
  logaUsuario: (usuarioLogado) => {
    set({ usuario: usuarioLogado });
    if (typeof window !== "undefined") {
      localStorage.setItem("usuarioKey", JSON.stringify(usuarioLogado));
    }
  },
  deslogaUsuario: () => {
    set({ usuario: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem("usuarioKey");
    }
  },
}));

export function UsuarioProvider({ children }: { children: React.ReactNode }) {
  const { logaUsuario } = useUsuarioStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("usuarioKey");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          logaUsuario(parsed);
        } catch (error) {
          console.error("Erro ao carregar usuário do localStorage:", error);
        }
      }
    }
  }, [logaUsuario]);

  return <>{children}</>;
}