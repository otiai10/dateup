#! /usr/bin/env node
import { exec } from "child_process";
import { createInterface } from "readline/promises";

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const BLUE = "\x1b[34m";
const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const NEWLINE = "\n";
const colorful = {
    stdout(...string): void {
        process.stdout.write(Array.from(arguments).join(""));
    }
}

async function getDeps(): Promise<{ [key: string]: PackageOutdatedInfo }> {
    colorful.stdout(CYAN, "Analyzing dependencies of your package...", RESET, NEWLINE);
    const cmd = "npm outdated -json";
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout) => {
            // if (err != null) return reject(err); // TODO: Always exit 1
            resolve(JSON.parse(stdout));
        });
    });
}

interface PackageOutdatedInfo {
    current: string;
    wanted: string;
    latest: string;
    dependent: string;
    location: string;
}

interface PackageInfo {
    package: string;
    target: string;
    // TODO: --save or --save-dev
}

async function __fordate__main(args: string[]): Promise<void> {
    // const wd = process.cwd();
    // console.log(wd);
    const dict = await getDeps();
    const keys = Object.keys(dict);
    if (keys.length == 0) {
        return colorful.stdout(CYAN, BOLD, "No outdated packages.", RESET, NEWLINE);
    }
    const updates: PackageInfo[] = [];
    const rl = createInterface({ input: process.stdin, output: process.stderr });
    LOOP1:
    for (let i = 0; i<keys.length; i++) {
        const name = keys[i];
        const info = dict[name];
        colorful.stdout(GREEN, BOLD, `[${i + 1}/${keys.length}]`, RESET);
        console.log(`Package ${name}, current version ${info.current}:`);
        console.log(`Wanted (w): ${info.wanted} | Latest (l): ${info.latest}`);
        const answer = await rl.question(`${BLUE}${BOLD}[w,l,n,s,q]? ${RESET}`);
        switch (answer) {
            case "s":
                console.log("ok, skip all.", NEWLINE);
                break LOOP1;
            case "q":
                console.log("ok, quit now.");
                rl.close();
                return Promise.resolve();
            case "w":
                updates.push({ package: name, target: info.wanted });
                break;
            case "l":
                updates.push({ package: name, target: info.latest });
                break;
        }
        colorful.stdout(NEWLINE);
    }
    rl.close();
    if (updates.length == 0) {
        return colorful.stdout(CYAN, BOLD, "No packages to be updated.", RESET, NEWLINE);
    }
    // console.log(updates);
    const cmdstr = updates.map(update => `${update.package}@${update.target}`).join(" ");

    colorful.stdout(NEWLINE, CYAN, BOLD, "Here is the command you want to run:", RESET, NEWLINE, NEWLINE);
    console.log(`npm install ${cmdstr}`, NEWLINE);
}

(async () => {
    if (require.main === module) {
        try {
            await __fordate__main(process.argv);
        } catch (err) {
            throw err;
        }
    }
})();
