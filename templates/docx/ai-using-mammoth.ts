// function written by ai
import fs from 'fs'
import mammoth from 'mammoth'
let stylecss = fs.readFileSync(__dirname + '/style.css').toString();

export async function convertDocxToHtml(inputPath: string) {
    console.log('superduperstring', inputPath)
    try {
        const options = {
            styleMap: [
                // 1. Tell Mammoth to treat underlines as <u> tags
                "u => u",

                // 2. Map specific Word Character Styles to CSS classes
                // (In Word, highlight text and create a 'Character Style' named 'LargeText')
                "r[style-name='LargeText'] => span.large-text",
                "r[style-name='SmallText'] => span.small-text",

                // 3. Map headings normally
                "p[style-name='Heading 1'] => h1:fresh",
            ]
        };

        const result = await mammoth.convertToHtml({ path: inputPath }, options);

        const fullPage = `

    <style>
    ${stylecss}
    </style>

<div class="document normallinks">
    ${result.value}
</div>
</html>`;

        console.log('bussinbutt', fullPage)
        return fullPage

    } catch (error) {
        console.error('stupiderror', error);
    }
}