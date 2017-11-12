## A first hash function

* Hash functions are for reducing data from arbitrary to fixed
* Used to convert data to a integer within a range
* We can use that idea to convert a name to a port, eg for micro-services
* Simple hashing: converting chars to ints, figure out how to reduce
* Can reduce using modulo!
* TODO: Find two strings that collide
* Propose a different schema
* We can use probability to find a appropriate hash size

## De-duplication

* If we make the space large enough, and our function diffuses/avalanche enough
  a hash can be a intrinsic, deterministic name, like a fingerprint
* Idea is also called Content-Addressable Storage, ie. the content is it's own
  address => name
* This can be used to deduplicate user uploads
* It does however require us to look at all the data before we can determine the
  name, so we need temp storage
* This might seem like a downside, but hang in there
* DEMO
* This is one of the things git uses hash functions for, tracking identical files
* A very cool package manager uses this technique too, IED which portray the
  drawbacks of CAS as strengths

https://github.com/mafintosh/content-addressable-blob-store
https://github.com/git/git/blob/4123bcaed0897cad152c052a5fa4e499e4dafcf4/diffcore-rename.c#L258-L267
https://github.com/alexanderGugel/ied/blob/master/src/install.js#L361-L394

## Document Search Engine

* Similarity search
* Similarity in data, not meaning
* Similarity measure - Jaccard Distance
* How do we turn a document into a set / bag?
* Shingling - Either by char or word

Reference: (Mining Massive Data Sets)[http://www.mmds.org/]

## Spam

*

http://hashcash.org/
https://indutny.github.io/vote.wdgt/
