import express from 'express'
import cors from 'cors'
import routesJogos from './routes/jogos'
import routesFotos from './routes/fotos'
import routesLogin from './routes/login'
import routesUsuarios from './routes/usuarios'
import routesAvaliacoes from './routes/avaliacoes'


const app = express()
const port = 3001

app.use(express.json())
app.use(cors())

app.use("/jogos", routesJogos)
app.use("/fotos", routesFotos)
app.use("/usuarios", routesUsuarios)
app.use("/usuarios/login", routesLogin)
app.use("/avaliacoes", routesAvaliacoes)

app.get('/', (req, res) => {
  res.send('API: Review de Jogos')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})