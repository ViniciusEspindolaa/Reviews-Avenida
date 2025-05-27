import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { z } from 'zod';
import nodemailer from 'nodemailer';


const prisma = new PrismaClient();
const router = Router();

const avaliacaoSchema = z.object({
  usuarioId: z.string().uuid({ message: 'ID de usuário inválido' }),
  jogoId: z.number().int({ message: 'ID de jogo deve ser um número inteiro' }),
  comentario: z.string().min(1, { message: 'O comentário não pode estar vazio' }).max(500, { message: 'O comentário deve ter no máximo 500 caracteres' }),
  nota: z.number().int().min(0, { message: 'Nota deve ser no mínimo 0' }).max(10, { message: 'Nota deve ser no máximo 10' }),
});

router.get('/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;
  const valida = z.string().uuid({ message: 'ID de usuário inválido' }).safeParse(usuarioId);
  if (!valida.success) {
    res.status(400).json({ erro: valida.error });
    return;
  }
  try {
    const avaliacoes = await prisma.avaliacao.findMany({
      where: { usuarioId },
      include: { jogo: { include: { genero: true } } },
    });
    res.status(200).json(avaliacoes);
  } catch (error: unknown) {
    console.error('Erro ao buscar avaliações do usuário:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    res.status(400).json({ erro: errorMessage });
  }
});

router.post('/', async (req, res) => {
  console.log('Corpo da requisição:', req.body);

  const valida = avaliacaoSchema.safeParse(req.body);
  if (!valida.success) {
    console.log('Validação falhou:', valida.error);
    res.status(400).json({ erro: valida.error });
    return;
  }

  const { usuarioId, jogoId, comentario, nota } = valida.data;

  try {
    const avaliacao = await prisma.avaliacao.create({
      data: {
        usuarioId,
        jogoId,
        comentario,
        nota,
      },
    });
    res.status(201).json(avaliacao);
  } catch (error: unknown) {
    console.error('Erro ao criar avaliação:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    res.status(400).json({ erro: errorMessage });
  }
});

async function enviaEmail(nome: string, email: string, comentario: string, resposta: string) {
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: 'vinnyespindolao@gmail.com',
    to: email,
    subject: 'Re: Avaliação Avenida Reviews',
    text: `Comentário: ${comentario}\nResposta: ${resposta}`,
    html: `
      <h3>Estimado usuário: ${nome}</h3>
      <h3>Avaliação: ${comentario}</h3>
      <h3>Resposta: ${resposta}</h3>
      <p>Muito obrigado pela sua avaliação!</p>
      <p>Avenida Reviews</p>
    `,
  });

  console.log('Mensagem enviada: %s', info.messageId);
}

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { resposta } = req.body;

  if (!resposta) {
    res.status(400).json({ erro: 'Informe a resposta desta avaliação' });
    return;
  }

  try {
    const avaliacao = await prisma.avaliacao.update({
      where: { id: Number(id) },
      data: { resposta },
    });

    const dados = await prisma.avaliacao.findUnique({
      where: { id: Number(id) },
      include: {
        usuario: true,
      },
    });

    if (dados) {
      await enviaEmail(
        dados.usuario.nome,
        dados.usuario.email,
        dados.comentario,
        resposta
      );
    }

    res.status(200).json(avaliacao);
  } catch (error: unknown) {
    console.error('Erro ao atualizar avaliação:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    res.status(400).json({ erro: errorMessage });
  }
});

router.get('/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;
  const valida = z.string().uuid({ message: 'ID de usuário inválido' }).safeParse(usuarioId);
  if (!valida.success) {
    res.status(400).json({ erro: valida.error });
    return;
  }
  try {
    const avaliacoes = await prisma.avaliacao.findMany({
      where: { usuarioId },
      include: { jogo: { include: { genero: true } } },
    });
    res.status(200).json(avaliacoes);
  } catch (error: unknown) {
    console.error('Erro ao buscar avaliações do usuário:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    res.status(400).json({ erro: errorMessage });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const avaliacao = await prisma.avaliacao.delete({
      where: { id: Number(id) },
    });
    res.status(200).json(avaliacao);
  } catch (error: unknown) {
    console.error('Erro ao deletar avaliação:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    res.status(400).json({ erro: errorMessage });
  }
});

export default router;