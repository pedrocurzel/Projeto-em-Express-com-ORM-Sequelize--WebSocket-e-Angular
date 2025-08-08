import { randomBytes, scryptSync} from "crypto";

function hash(senha) {
    const salt = randomBytes(16).toString("hex");

    const hashS = scryptSync(senha, salt, 64).toString("hex");

    return {salt, hashS};
}