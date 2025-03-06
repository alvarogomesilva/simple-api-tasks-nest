import { compareSync, hashSync } from "bcrypt";
import { HashingService } from "./hashing.service";

export class BcryptService implements HashingService{
    
    async hash(password: string) {
        const saltOrRounds = 10;
        const hash = hashSync(password, saltOrRounds)

        return hash;
    }

    async compare(password: string, hash: string) {
        const isMatch = compareSync(password, hash)

        return isMatch;
    }
}