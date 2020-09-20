$(document).ready(

        $.reject(

                {

                    reject: {all: false, msie: 10, chrome: 34, firefox: 30, safari: 6},

                    display: ["chrome", "firefox", "safari"],

                    imagePath: "/images/mitr/older/",

                    header: "Did you know that your browser is out of date?",

                    paragraph1: "To access the full range of the Oxford iWriter's features, please upgrade your browser to the latest version. Visit <a href=\"https://auranticus.github.io/iWriter/help.html#_4_Browser_Compatability\">here</a> for more information.",

                    // paragraph2: "Just click on the icons to go to the download page.",

                    close: true,

                    closeMessage: "By closing this window you accept that some features of this application may not work.",

                    closeLink: "Close this window",

                    closeURL: "#",

                    closeESC: true,

                    closeCookie: false,

                    cookieSettings: {path: "/", expires: 1}, }

        )
        );