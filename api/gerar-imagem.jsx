import { ImageResponse } from '@vercel/og';
import path from 'path';
import fs from 'fs/promises';

// Esta função agora carrega as fontes diretamente do sistema de ficheiros do servidor.
// É a abordagem mais robusta e deve resolver o erro 404.
async function getLocalFonts() {
    // O Vercel executa o código a partir da raiz do projeto.
    // Este caminho aponta para a pasta /public/fonts a partir da raiz.
    const fontRegularPath = path.join(process.cwd(), 'public', 'fonts', 'Manrope-Regular.ttf');
    const fontBoldPath = path.join(process.cwd(), 'public', 'fonts', 'Manrope-Bold.ttf');

    try {
        const [font400, font700] = await Promise.all([
            fs.readFile(fontRegularPath),
            fs.readFile(fontBoldPath)
        ]);

        return [
            { name: 'Manrope', data: font400, weight: 400, style: 'normal' },
            { name: 'Manrope', data: font700, weight: 700, style: 'normal' },
        ];
    } catch (error) {
        console.error("Font loading error from filesystem:", error.message);
        // Retorna um array vazio para que a geração de imagem possa prosseguir sem fontes customizadas.
        return [];
    }
}


export default async function handler(request) {
    try {
        const { searchParams } = new URL(request.url, `http://${request.headers.get('host')}`);

        // Parâmetros da URL com valores padrão para segurança
        const title = searchParams.get('title')?.slice(0, 100) || 'Título do Livro';
        const author = searchParams.get('author')?.slice(0, 80) || 'Autor Desconhecido';
        const coverUrl = searchParams.get('coverUrl');
        const avatarUrl = searchParams.get('avatarUrl');
        const userName = searchParams.get('userName') ? `Lido por ${searchParams.get('userName').slice(0, 30)}` : 'Compartilhado por um leitor';

        // Carrega as fontes locais
        const manropeFonts = await getLocalFonts();

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#1F2428', // Cor de fundo do app
                        color: '#E1E3E6',
                        padding: '60px',
                        fontFamily: manropeFonts.length > 0 ? '"Manrope"' : 'sans-serif', // Usa a fonte apenas se ela foi carregada
                    }}
                >
                    {/* Cabeçalho com Avatar e Nome */}
                    <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'flex-start' }}>
                        {avatarUrl && <img src={avatarUrl} width="60" height="60" style={{ borderRadius: '50%' }} />}
                        <span style={{ marginLeft: '20px', fontSize: 32, fontWeight: 700 }}>{userName}</span>
                    </div>

                    {/* Conteúdo Principal do Livro */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                        {coverUrl && <img src={coverUrl} width="280" style={{ borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />}
                        <h1 style={{ fontSize: 64, fontWeight: 700, textAlign: 'center', marginTop: '40px', lineHeight: 1.2 }}>{title}</h1>
                        <p style={{ fontSize: 42, fontWeight: 400, color: '#8A9199', marginTop: '10px' }}>{author}</p>
                    </div>

                    {/* Rodapé */}
                    <div style={{ fontSize: 24, alignSelf: 'flex-end', color: '#5F6770' }}>
                        Gerado por Book Tracker
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
                fonts: manropeFonts,
            },
        );
    } catch (e) {
        console.error("Erro na API de imagem:", e.message);
        return new Response('Falha ao gerar a imagem.', { status: 500 });
    }
}
