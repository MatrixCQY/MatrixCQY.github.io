# QY CHENG's Academic Website

This repository hosts the source code for the personal academic website of **QY CHENG**.

**Live Website**: [https://MatrixCQY.github.io](https://MatrixCQY.github.io)

## Overview

This website is designed for academic purposes, showcasing publications, teaching experience, and research notes. It is built using:
- [Jekyll](https://jekyllrb.com/) (Static Site Generator)
- [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/) (Theme)
- [Academic Pages](https://academicpages.github.io/) (Template)

## Maintenance & Editing

If you need to update the content of the website, here are the key locations:

### Site Configuration
- **[_config.yml](_config.yml)**: Main configuration file. Update your name, bio, social links, and site title here.
- **[_data/navigation.yml](_data/navigation.yml)**: Customize the top navigation bar items.

### Content Management
- **[_pages/](_pages/)**: Contains the main pages like "About Me" (`about.md`), "CV" (`cv.md`), etc.
- **[_publications/](_publications/)**: Add or edit your research papers here as individual Markdown files.
- **[_teaching/](_teaching/)**: List your teaching experience and courses.
- **[_posts/](_posts/)**: For blog posts or research updates.

### Profile Image
- **[images/profile.png](images/profile.png)**: Replace this file to update the sidebar avatar.

## Local Development

To run the site locally for testing:

1. Install Ruby and Jekyll.
2. Run `bundle install`.
3. Run `bundle exec jekyll serve`.
4. Open `http://localhost:4000` in your browser.

## License
This project is based on the [Academic Pages](https://github.com/academicpages/academicpages.github.io) template, which is derived from the [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes) theme, licensed under the MIT License.
