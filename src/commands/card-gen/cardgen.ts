import { ApplicationCommandOptionChoice } from "discord.js";
import path from "path";
import { loadImage, createCanvas } from "canvas"
import { CanvasTextWrapper } from "canvas-text-wrapper"
import { Command } from "../../structures/Command";

const dataPath = path.resolve(process.env.data_path, "card-gen");
const typesFile = "types.json";
const ConfigFile = "config.json";
const imgPath = "img";
const templatePath = "template";
const CardTypes = require(path.join(dataPath, typesFile));

const typeChoices: ApplicationCommandOptionChoice[] = [];
for (const key in CardTypes) {
    let choice = { name: key, value: key };
    typeChoices.push(choice);
}

export default new Command({
    name: "cardgen",
    description: "Generates a yu-gi-oh card",
    options: [
        {
            name: "type",
            description: `Choose the type of the card.`,
            type: "STRING",
            required: true,
            choices: typeChoices
        },
        {
            name: "name",
            description: `Title of the card`,
            type: "STRING",
            required: true,
        },
        {
            name: "url",
            description: `Image URL`,
            type: "STRING",
            required: true,
        },
        {
            name: "description",
            description: `Description of the card`,
            type: "STRING",
            required: false,
        },
        {
            name: "attack",
            description: `Attack power`,
            type: "INTEGER",
            required: false,
        },
        {
            name: "defense",
            description: `Defense power`,
            type: "INTEGER",
            required: false,
        },
        {
            name: "level",
            description: `Level of the card`,
            type: "INTEGER",
            required: false,
        },
    ],
    run: async ({ interaction }) => {
        const { options } = interaction;

        const type = options.getString("type");
        const name = options.getString("name");
        const url = options.getString("url");
        const desc = options.getString("description") || "";
        const attack = options.getInteger("attack") || 1;
        const defense = options.getInteger("defense") || 1;
        const level = options.getInteger("level") || 1;

        const {
            width, height,
            file,
            nameX, nameY,
            descW, descH, descX, descY,
            atk, atkX,
            statY, statW,
            def, defX,
            lvl, lvlX, lvlY, lvlWH,
            imgX, imgY, imgW, imgH
        } = CardTypes[type];

        const Config = require(path.join(dataPath, ConfigFile));
        const { titleFont, statFont, starAsset, notFoundAsset } = Config;

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        const bg = await loadImage(path.join(dataPath, imgPath, templatePath, file));
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

        ctx.font = titleFont;
        ctx.fillText(name, nameX, nameY, width - 2 * nameX);

        const canvasDesc = createCanvas(descW, descH);
        CanvasTextWrapper(canvasDesc as unknown as HTMLCanvasElement,
            desc,
            {
                sizeToFill: true,
                paddingX: 5,
                paddingY: 5
            });
        ctx.drawImage(canvasDesc, descX, descY);

        // stat - atk
        ctx.font = statFont;

        if (atk)
            ctx.fillText(attack.toString(), atkX, statY, statW);

        if (def)
            ctx.fillText(defense.toString(), defX, statY, statW);

        if (lvl) {
            const starImg = await loadImage(path.join(dataPath, imgPath, starAsset));
            for (let i = 0; i < clamp(level, 0, 12); i++)
                ctx.drawImage(starImg, lvlX - i * lvlWH, lvlY, lvlWH, lvlWH);
        }

        let [img, imgErr] = await handle(loadImage(url));
        if (imgErr) {
            img = await loadImage(path.join(dataPath, imgPath, notFoundAsset));
        }

        ctx.drawImage(img, imgX, imgY, imgW, imgH);

        await interaction.reply({
            files: [
                canvas.toBuffer()
            ]
        });
    }
})

const handle = (promise: any) => {
    return promise
        .then((data: any) => ([data, undefined]))
        .catch((error: any) => Promise.resolve([undefined, error]));
};

function clamp(num: number, min: number, max: number) {
    return num <= min ? min : num >= max ? max : num;
}