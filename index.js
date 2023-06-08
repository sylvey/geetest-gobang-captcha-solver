const puppeteer = require("puppeteer");
const searchingLines = require("./searchingLine");

async function getGolanMatrix(page) {
  await page.waitForSelector('[aria-label="Click to verify"]');
  await page.waitFor(1000);
  await page.click('[aria-label="Click to verify"]');
  await page.waitFor(1000);

  const matrix_to_return = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ];

  const indexList = [
    1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15, 17, 18, 19, 21, 22, 23, 25, 26, 27,
    29, 30, 31, 33,
  ];
  const imageList = [];

  for (let rowInd = 0; rowInd < 5; rowInd++) {
    for (let colInd = 0; colInd < 5; colInd++) {
      let item = await page.waitForSelector(
        ".geetest_item-" + rowInd + "-" + colInd
      );
      const backgroundImageUrl = await item.evaluate((element) => {
        const style = window.getComputedStyle(element);
        return style.getPropertyValue("background-image");
      });
      if (backgroundImageUrl != "none") {
        if (imageList.find((x) => x === backgroundImageUrl)) {
          const ind = imageList.findIndex((x) => x === backgroundImageUrl);
          matrix_to_return[rowInd][colInd] = indexList[ind];
        } else {
          imageList.push(backgroundImageUrl);
          ind = imageList.length - 1;
          matrix_to_return[rowInd][colInd] = indexList[ind];
        }
      }
    }
  }

  await page.waitFor(2000);
  return matrix_to_return;
}

function exchangePoints(matrix) {
  let blankPos = [0, 0];
  let exchangePos = [0, 1];
  searchingLines.every((line) => {
    let occurrences = {};
    line.forEach((position) => {
      const value = matrix[position[0]][position[1]];
      if (value === 0) {
        return;
      }
      if (occurrences[value]) {
        occurrences[value]++;
      } else {
        occurrences[value] = 1;
      }
    });

    for (let occur in occurrences) {
      if (occurrences[occur] == 4) {
        const posInd = line.findIndex((position) => {
          return matrix[position[0]][position[1]] != occur;
        });

        blankPos = line[posInd];

        matrix.some((row, indR) => {
          let find = false;
          row.some((item, indC) => {
            if (
              item == occur &&
              !line.find((pos) => pos[0] === indR && pos[1] === indC)
            ) {
              find = true;
              exchangePos = [indR, indC];
            }
            return find;
          });
          return find;
        });

        return false;
      }
    }

    return true;
  });

  return { exchangePos, blankPos };
}

async function run() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1366, height: 768 },
  });
  const page = await browser.newPage();

  await page.goto("http://gt4.geetest.com/demov4/winlinze-popup-en.html");

  await page.waitFor(1000);

  const golang_matrix = await getGolanMatrix(page);

  const { exchangePos, blankPos } = exchangePoints(golang_matrix);
  console.log(exchangePos, blankPos);

  await page.click(".geetest_item-" + exchangePos[0] + "-" + exchangePos[1]);
  await page.waitFor(1000);
  await page.click(".geetest_item-" + blankPos[0] + "-" + blankPos[1]);
}

run();
