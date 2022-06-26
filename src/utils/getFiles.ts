import { readdirSync } from "fs";
import { join } from "path";

const getFiles = (dir: string, suffix: string) => {
    let files: any[] = [];

    readdirSync(dir, { withFileTypes: true }).forEach((file) => {
        if (file.isDirectory()) {
            files = [...files, ...getFiles(`${dir}/${file.name}`, suffix)];
        } else {
            if (
                !file.name.endsWith(suffix) ||
                file.name.endsWith(`.test${suffix}`)
            )
                return;

            files.push(join(dir, file.name));
            return;
        }
    });

    return files;
};

export default getFiles;