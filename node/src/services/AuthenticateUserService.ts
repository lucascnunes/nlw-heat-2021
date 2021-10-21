import axios from "axios";
import prismaClient from "../prisma";
import { sign } from "jsonwebtoken";

/**
 * Receber code(string)
 * Recuperar o access_token no GitHub
 * Recuperar infos do user no GitHub
 * Verificar se o usuário existe no BD
 * --- SIM = Gera um token
 * --- NÃO = Cria no BD, gera um token
 * Retornar o token com as informações do usuário
 */

interface IAccessTokenResponse {
  access_token: string;
}

interface IUserResponse {
  avatar_url: string,
  login: string,
  id: number,
  name: string;
}

class AuthenticateUserService {

  async execute(code: string, app_request?: string) {
 
    const url = "https://github.com/login/oauth/access_token";

    let params;
    if (app_request && app_request === 'react') {
      params = {
        client_id: process.env.REACT_GITHUB_CLIENT_ID,
        client_secret: process.env.REACT_GITHUB_CLIENT_SECRET,
        code,
      }
    } else {
      params = {
        client_id: process.env.APP_GITHUB_CLIENT_ID,
        client_secret: process.env.APP_GITHUB_CLIENT_SECRET,
        code,
      }
    }
    
    const { data: accessTokenResponse } = await axios.post<IAccessTokenResponse>(url, null, { 
      params: params,
      headers: {
        "Accept": "application/json"
      }
    });

    const response = await axios.get<IUserResponse>("https://api.github.com/user", {
      headers: {
        Authorization: "Bearer " + accessTokenResponse.access_token
      }
    });

    const { login, id, avatar_url, name } = response.data;

    let user = await prismaClient.user.findFirst({ 
      where: {
        github_id: id
      }
    });

    if (!user) {
      user = await prismaClient.user.create({
        data: {
          github_id: id,
          login,
          avatar_url,
          name
        }
      })
    }

    const token = sign({
      user: {
        name: user.name,
        avatar_url: user.avatar_url,
        id: user.id
      }
    }, process.env.JWT_SECRET,
    {
      subject: user.id,
      expiresIn: "1d"
    });

    return { token, user };
  }

}

export { AuthenticateUserService }