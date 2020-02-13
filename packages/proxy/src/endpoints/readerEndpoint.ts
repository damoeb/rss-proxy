import {Express, Request, Response} from 'express';
import logger from '../logger';
import * as cors from 'cors';
import {readerService} from '../services/readerService';

export const readerEndpoint = new class ProxyEndpoint {
  register(app: Express) {

    app.get('/api/content/json', cors(), (request: Request, response: Response) => {
      const url = request.query.url;
      logger.info(`reader-mode ${url} as json`);
      if (url) {
        readerService.parseArticle(url)
          .then(result => {
            response.json(result);
          })
          .catch(err => {
            response.json({error: err})
          });
      } else {
        response.json({error: 'param url is missing'})
      }
    });

    app.get('/api/reader', cors(), (request: Request, response: Response) => {
      const url = request.query.url;
      logger.info(`reader-mode ${url}`);
      if (url) {
        readerService.reader(url).then(result => {
          response.setHeader('content-type', 'text/html');
          const template = `
<html lang="${result.meta.language}">
<title>${result.readability.title}</title>
<style>
.r {
  max-width: 680px;
  margin: auto;
  font-family: Georgia, Cambria, "Times New Roman", Times, serif;
  letter-spacing: -0.004em;
  line-height: 1.58;
  word-break: break-word;
}
img {
  width: 100%;
}
</style>
<script>
document.addEventListener("DOMContentLoaded", () => {

  const links = Array.from(document.querySelectorAll('.c a')).map((originalLink, index) => {

    const link = originalLink.cloneNode();
    
    const url = originalLink.getAttribute('href');
    link.setAttribute('href', location.origin + '/api/reader?url=' + encodeURIComponent(url));
    
    const text = document.createElement('span');
    text.innerText = link.textContent + ' ';
    
    originalLink.replaceWith(text);
    const linkText = index + 1;
    // const linkText = new URL(url).hostname;
    link.innerText = '['+ linkText +']';
    link.setAttribute('title', url);
    text.append(link);
    return originalLink;
  });

  const references = links.map((link, index) => {
    return '<p><a name="'+ (index + 1) +'"></a>['+ (index + 1) +'] <a="'+link.getAttribute('href')+'" target="_blank">'+link.getAttribute('href') +'</a></p>';
  }).join(' ');

  document.querySelector('.references').innerHTML = references;
});

</script>
<body>
<div class="r">
  <p><a href="${url}" target="_blank">${url}</a></p>
  <h1 style="margin-top: 150px">${result.readability.title}</h1>
<!--  <p>${result.meta.date}</p>-->
  <p style="padding-bottom: 20px"><strong>TLDR</strong>: ${result.readability.excerpt}</p>
  <div class="c">
    ${result.readability.content}
  </div>
  <div style="border-top: 2px solid black; margin-top: 50px" class="references">
  </div>
</div>
</body>
</html>`;
          response.send(template);

        }).catch(err => {
          logger.error(`Failed to apply reader-mode of ${url}, cause ${err}`);
          response.redirect(url);
        });
      } else {
        response.json({error: 'param url is missing'})
      }
    });

  }
}
