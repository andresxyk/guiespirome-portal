export class UserRes {
    mensaje!:   string;
    respuesta!: UserData;
    estatus!:   boolean;
    code!:      number;
}

export class UserData {
    expira!:          Date;
    expiresInSecond!: string;
    delegacion!:      string;
    nombreUsuario!:   string;
    cveDelegacion!: string;
    token!:           string;
    umf!:             string;
    perfil!:          string;
    tokenDateLogged?: Date;
}

export class UserReq {
    usuario!: string;
    password!: string;
}

export class Refresh {
    mensaje!:   string;
    respuesta!: RefreshData;
    estatus!:   boolean;
    code!:      number;
}

export class RefreshData {
    expira!:          Date;
    expiresInSecond!: string;
    token!:           string;
}