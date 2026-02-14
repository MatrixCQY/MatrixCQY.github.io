---
title: "Notes"
layout: archive
permalink: /notes/
author_profile: true
---

## Blog Posts
[https://matrixcqy.github.io/bbblog/](https://matrixcqy.github.io/bbblog/)

## PDF Notes
[📂 Read PDF Online (Example)](/pdf-viewer/?file=/files/example.pdf)

> **Instructions**: To add your own PDF:
> 1. Upload your PDF file to the `files/` folder in this repository.
> 2. Copy the link format above: `/pdf-viewer/?file=/files/YOUR_FILENAME.pdf`

{% include base_path %}
{% for post in site.posts %}
  {% include archive-single.html %}
{% endfor %}
