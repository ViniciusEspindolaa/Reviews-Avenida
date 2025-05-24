"use client"
import { JogoItf } from "@/utils/types/JogoItf";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";

export default function Detalhes() {
  const params = useParams()

  const [jogo, setJogos] = useState<JogoItf>()

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/jogos/${params.jogo_id}`)
      const dados = await response.json()
      // console.log(dados)
      setJogos(dados)
    }
    buscaDados()
  }, [])

  return (
    <>
      <section className="flex mt-6 mx-auto flex-col items-center bg-zinc-900 border border-red-900 rounded-lg shadow-sm dark:bg-black dark:border-red-800 md:flex-row md:max-w-5xl hover:shadow-red-900/20 hover:shadow-lg transition-all duration-300">
  {jogo?.foto && (
    <div className="relative w-full md:w-1/2 h-96 md:h-auto">
      <img
        className="object-cover w-full h-full rounded-t-lg md:rounded-none md:rounded-s-lg"
        src={jogo.foto}
        alt={`Capa do jogo ${jogo.nome}`}
      />
      <span className="absolute bottom-2 right-2 bg-red-800 text-white text-xs font-semibold px-2.5 py-1 rounded shadow-md dark:bg-red-900 border border-white">
        {jogo.genero.nome}
      </span>
    </div>
  )}

  <div className="flex flex-col justify-between p-6 leading-normal w-full text-white space-y-3">
  <h1 className="text-5xl font-extrabold text-center mb-6 text-white bg-clip-text underline dark:from-red-400 dark:to-red-700">
  {jogo?.nome}
</h1>


    <div className="text-sm text-zinc-300 dark:text-zinc-400">
      <span className="font-semibold text-red-400 dark:text-red-500">Ano:</span> {jogo?.ano}
    </div>

    <div className="text-sm text-zinc-300 dark:text-zinc-400">
      <span className="font-semibold text-red-400 dark:text-red-500">Desenvolvedora:</span> {jogo?.desenvolvedora}
    </div>

    <div className="text-sm text-zinc-300 dark:text-zinc-400">
      <span className="font-semibold text-red-400 dark:text-red-500">Publicadora:</span> {jogo?.publicadora}
    </div>

   { <div className="text-sm text-zinc-300 dark:text-zinc-400">
      <span className="font-semibold text-red-400 dark:text-red-500">Plataforma:</span> {jogo?.plataforma}
    </div> }

    <p className="mt-2 text-zinc-300 dark:text-zinc-400 text-sm border-t pt-4 border-red-900/30">
      <span className="text-red-400 dark:text-red-500 font-medium">Descrição:</span> {jogo?.descricao}
    </p>
  </div>
</section>
    </>
  )
}