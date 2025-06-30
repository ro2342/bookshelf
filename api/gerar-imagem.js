import { ImageResponse } from '@vercel/og';

export const config = {
    runtime: 'edge',
};

// Função para buscar a fonte Manrope do Google Fonts
async function getManropeFont() {
    const response = await fetch('https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&display=swap');
    const css = await response.text();
    const fontUrlRegex = /src: url\((.+?)\)/g;
    const fontUrls = [];
    let match;
    while ((match = fontUrlRegex.exec(css)) !== null) {
        fontUrls.push(match[1]);
    }

    const font400url = fontUrls.find(url => url.includes('Manrope-Regular')); // Ajuste se necessário
    const font700url = fontUrls.find(url => url.includes('Manrope-Bold')); // Ajuste se necessário

    const [font400, font700] = await Promise.all([
        fetch(font400url).then(res => res.arrayBuffer()),
        fetch(font700url).then(res => res.arrayBuffer())
    ]);

    return [
        { name: 'Manrope', data: font400, weight: 400, style: 'normal' },
        { name: 'Manrope', data: font700, weight: 700, style: 'normal' },
    ];
}


export default async function handler(request) {
    try {
        const { searchParams } = new URL(request.url);

        // Parâmetros da URL com valores padrão para segurança
        const title = searchParams.has('title') ? searchParams.get('title').slice(0, 100) : 'Título do Livro';
        const author = searchParams.has('author') ? searchParams.get('author').slice(0, 80) : 'Autor Desconhecido';
        const coverUrl = searchParams.get('coverUrl');
        const avatarUrl = searchParams.get('avatarUrl');
        const userName = searchParams.has('userName') ? `Lido por ${searchParams.get('userName').slice(0, 30)}` : 'Compartilhado por um leitor';

        // Carrega as fontes
        const manropeFonts = await getManropeFont();

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
                        fontFamily: '"Manrope"',
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
        console.error(e);
        return new Response('Falha ao gerar a imagem.', { status: 500 });
    }
}
