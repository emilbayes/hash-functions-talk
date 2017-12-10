# Deduplication

This example includes a HTTP server on `localhost:2017`, which takes
`POST /` requests for upload and `GET /{hash_value}` for download.
The technique is called Content Addressable Storage (CAS).

Upload a file to CAS:

```sh
curl --method POST --upload-file FILENAME http://localhost:2017/
```


Download a file by HASH_DIGEST:

```sh
curl http://localhost:2017/HASH_DIGEST > FILENAME
```
