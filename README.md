# Oxford iWriter
An interactive tool designed to help you write more effectively in English.

**==Also check out [iSpeaker](http://github.com/yell0wsuit/ispeaker) that helps learners speak English more accurately and fluently in a variety of situations.==**

Visit the website to use the tool: <a href="https://yell0wsuit.github.io/iWriter/" target="_blank">https://yell0wsuit.github.io/iWriter/</a>

![](https://i.imgur.com/xH0O83s.png)

This tool is ported from the *Oxford Advanced Learner's Dictionary 8th Edition*'s CD-ROM to *OALD 9th Edition* in HTML format. It is also available for premium users on the **Oxford Learner's Dictionaries** website, however, it was deprecated on Dec 31, 2020 in favor of new design.

This reposity is created to preserve this version, which works independently without relying on the **Oxford Learner's Dictionaries** website's resources. The new design, however, requires online server to function.

More information can be found in the <a href="https://yell0wsuit.github.io/iWriter/help.html" target="_blank">Help section</a>.

## Features
- Rewritten the interface using <a href="https://getbootstrap.com/" target="_blank">Bootstrap 5</a>. Fully compatible with dark theme.
- Replaced PNG icons with SVG. Courtesy of <a href="https://www.svgrepo.com/" target="_blank">https://www.svgrepo.com/</a>.
- Rewritten the Help section in clean HTML format for smaller file size (it was bloated before due to Microsoft Word -> HTML).
- More information is added in the Models/My Writing section.
- Added new topics from the iWriter's new design (more coming soon if there's any).
- De-bloated the tool by removing unnecessary images and scripts.
- PWA and offline support. You can install this tool as an app to access it offline.

Please note that due to interface changes, this tool is no longer compatible with old browsers (Internet Explorer 11 for example).

## Browser compatibility
Work on the latest version of the following browsers:
- Chromium browsers (Microsoft Edge, Chrome, Opera, Brave, ...)
- Mozilla Firefox (in Private Browsing there're some issues)
- Safari (macOS, iOS, iPadOS)

## Run the tool offline
Download this repository (or clone it) on your hard drive. Then use Python and create a local server `python -m http.server` to access it.

## Known bugs
- In Mozilla Firefox, there're some issues with saving/loading iWriter projects when using Private Browsing. This is a known bug by the browser itself.
