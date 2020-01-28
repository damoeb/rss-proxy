import {Express, Request, Response} from 'express';
import logger from '../logger';
import * as cors from 'cors';
import {readerService} from '../services/readerService';

export const readerEndpoint = new class ProxyEndpoint {
  register(app: Express) {

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
  display: none;
}
</style>
<script>
document.addEventListener("DOMContentLoaded", () => {

  const links = Array.from(document.querySelectorAll('.c a')).map((link, index) => {
    link.replaceWith(link.textContent +' ['+( index + 1)+']');
    return link;
  });

  const footerLinks = links.map((link, index) => {
    return '<p><a name="'+ (index + 1) +'"></a>['+ (index + 1) +'] <a="'+link.getAttribute('href')+'" target="_blank">'+link.getAttribute('href') +'</a></p>';
  }).join(' ');
  
  console.log(footerLinks);
  
  document.querySelector('.links').innerHTML = footerLinks;
});

</script>
<body>
<div class="r">
  <h1><a href="url">${result.readability.title}</a></h1>
  <p>${result.meta.date}</p>
  <p>${result.readability.excerpt}</p>
  <div class="c">
    ${result.readability.content}
  </div>
  <div class="links"></div>
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
