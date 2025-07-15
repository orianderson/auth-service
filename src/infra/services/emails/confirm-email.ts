export const confirmEmail = (name: string, token?: string): string => `
    <!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Confirmação de Usuário</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      font-family: 'FKGroteskNeue', 'Geist', 'Inter', -apple-system,
        BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
      background-color: #f5f5f5;
    "
  >
    <table role="presentation" style="width: 100%; border-collapse: collapse">
      <tr>
        <td style="padding: 32px 16px; text-align: center">
          <table
            role="presentation"
            style="
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            "
          >
            <!-- Cabeçalho -->
            <tr>
              <td
                style="
                  padding: 32px 32px 24px;
                  text-align: center;
                  background-color: #1fb8cd;
                  border-radius: 8px 8px 0 0;
                "
              >
                <h1
                  style="
                    margin: 0;
                    color: #ffffff;
                    font-size: 24px;
                    font-weight: 600;
                  "
                >
                  Bem-vindo!
                </h1>
              </td>
            </tr>
            <!-- Conteúdo -->
            <tr>
              <td style="padding: 32px">
                <p style="margin: 0 0 16px; color: #333333; font-size: 16px">
                  Olá ${name}
                </p>
                <p style="margin: 0 0 24px; color: #333333; font-size: 16px">
                  Estamos felizes em ter você como parte da nossa Comunidade!
                  Para começar a usar nossa plataforma, por favor confirme seu
                  e-mail clicando no botão abaixo:
                </p>
                <table role="presentation" style="margin: 0 auto">
                  <tr>
                    <td
                      style="
                        background-color: #1fb8cd;
                        border-radius: 6px;
                        text-align: center;
                      "
                    >
                      <button
                        style="
                          display: inline-block;
                          padding: 12px 24px;
                          color: #ffffff;
                          text-decoration: none;
                          font-weight: 500;
                          font-size: 16px;
                          background-color: #1fb8cd;
                        "
                        >${token}</button
                      >
                    </td>
                  </tr>
                </table>
                <p style="margin: 24px 0 0; color: #666666; font-size: 14px">
                  Se você não criou uma conta em nosso sistema, por favor ignore
                  este e-mail.
                </p>
              </td>
            </tr>
            <!-- Rodapé -->
            <tr>
              <td
                style="
                  padding: 24px 32px;
                  background-color: #e8f8fa;
                  border-radius: 0 0 8px 8px;
                "
              >
                <p
                  style="
                    margin: 0;
                    color: #666666;
                    font-size: 14px;
                    text-align: center;
                  "
                >
                  Este é um e-mail automático. Por favor, não responda.
                  <br />
                  © 2025 OriSistem. Todos os direitos reservados.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

`;
