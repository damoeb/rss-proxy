# Troubleshooting

## Invalid XML
**Problem**: ATOM feeds may return an invalid XML due to a [known issue](https://github.com/jpmonette/feed/issues/112) in a dependency. 

**Mitigation**: Change the output format to RSS

## Bot Protection
**Problem**: Some sites have protection mechanism against bots. Requests to those sites may only return a minimal markup containing redirects or errors.

**Mitigation**: [Activate JavaScript](https://github.com/damoeb/rss-proxy/#javascript-support) will most likely bypass these mechanisms.
