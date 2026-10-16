# Astha Jyotish

![Built with the help of REA](https://img.shields.io/badge/built%20with%20the%20help%20of-REA-3949ab)

This is a horoscope web app built from a program that lived on a Windows machine long before web apps were cool. The calculations are new. The name, and the reason for doing it, are older. Built with the help of [REA](https://github.com/morluto/rea).

## Why the name is Astha Jyotish

My father is an advocate by profession and an astrologer by passion. The second one was never a costume he put on for family functions. Clients, courts, and charts sat in the same life. He read a kundli the way he read a brief: slowly, with the page in front of him, and with no interest in skipping to the last line.

Retirement did not close that. After he left practice he went back to university and did an MA in Astrology. Nobody asked him to. There was no new career waiting at the end of it. He sat for the degree because he loved the subject and wanted to study it properly, the way a working lawyer studies a statute he already thinks he knows.

Around 2010 to 2014 he did something that, in our house, felt early. The internet in India was still patchy, still a thing you explained to relatives, still not the place most people went for a birth chart. He started an astrology website anyway and named it Astha Jyotish. It was his corner of the web before the web was crowded. When this app needed a name, that was the one. Not a brand invented for a repository. The name he had already chosen.

## The program he actually used

The working tool was not a website. It was Kundli 2000 Pro, a Windows desktop program from the era when software came on a disc, installed into Program Files, and printed its answer. You typed a name, a sex, a date and a time, a place, a time zone. You chose an ayanamsa, a chart style, true or mean Rahu. You could add a father's name, a mother's name, a grandfather's name, a gotra. Then you pressed for a preview, and the preview was not one chart. It was a stack of pages: the title sheet, the longitudes, the divisional charts, the dashas, the yogini periods, the varshphal, the printed reading. Print meant the whole stack.

That program still belongs to its decade. It expects an old Windows desktop. It does not travel. A phone cannot open it, a link cannot point at it, and the only copy of a chart is the paper that came out of the printer. For years that was enough, because that was how the work was done. It stopped being enough the day the same work needed to live somewhere a person could open without that machine.

## How REA made the port possible

I did not have the source. I had the installed program. Guessing the screens from memory would have produced a cousin of the app, not the app. [REA](https://github.com/morluto/rea), Reverse Engineer Anything, was the way in.

REA took the executable apart far enough to see what the program was actually doing, not what a brochure would have said it did. The binary is an old Visual Basic program. Its interesting parts are not a clean list of features. They are form controls, window titles, and the strings that name each page of the printed horoscope. REA walked those. The birth form came back field by field: the clock, the Indian time zone, the place with latitude and longitude, the war and summer correction tucked under the time, Lahiri and the other ayanamsas, north and south charts, the family lines, the yogini start date, the varshphal year. The page list came back in order, from the title page through the nirayana and sayana sheets, the bhava and sudarshan charts, KP, Sade Sati, the manglik note, the shodashvarga, the vimshottari mahadasha and the long pratyantar tables, yogini, chara dasha, the prediction pages, and varshphal. The print command was not a separate export format. It was that same stack of pages, sent to the printer.

That was the specification. A frozen program, read from the outside, turned into a list of inputs and a list of pages.

What I did not take was the program's own library of prediction sentences. Those belong to the old software. The web app keeps the shape of the report and does the astronomy and the classical rules itself: sidereal longitudes, houses, dashas, vargas, the pages a reader expects to turn. The prose on those pages is written for this app. The order of the pages is the order REA found in the original.

## What the web app is

Astha Jyotish is that sitting, moved. You enter a birth. You can search a city instead of hunting through a database screen. You can switch the form between English and Hindi. Preview opens the report as pages, with the list fixed on the side, and print sends every page. The old window can stay installed on the old computer. This one opens in a browser, under the name my father put on a website when almost nobody in India was putting astrology on the internet.