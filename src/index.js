import * as commonmark  from "commonmark";
import { readFileSync, listDir } from "./lib/utils/filereader.js";
import path from "path";

const BOOK_PATH = "book";
const frontFile = path.join(BOOK_PATH, "front.md");

const frontMD = readFileSync(frontFile);
const frontTemplate = readFileSync(path.join("src", "templates", "front.template.html"));

console.log(frontTemplate);

var reader = new commonmark.Parser();
var writer = new commonmark.HtmlRenderer();
var parsed = reader.parse(frontMD);

// transform parsed if you like...
var result = writer.render(parsed);
const frontPage = frontTemplate.replace("{{front.md}}", result)
 // result is a String
// console.log(frontPage)


/*
var reader = new commonmark.Parser();
var writer = new commonmark.HtmlRenderer();
var parsed = reader.parse("Hello *world*"); // parsed is a 'Node' tree
// transform parsed if you like...
var result = writer.render(parsed); // result is a String
console.log(result)
*/