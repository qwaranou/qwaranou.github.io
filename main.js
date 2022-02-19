let contentElement = document.getElementById('content');
let messageAccessories = document.getElementById('message-accessories');
let reactionElement = document.getElementById('message-reactions');

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

const base64Decode = (urlSafeBase64) => {
    const base64 = urlSafeBase64.replace(/-/g, "+").replace(/_/g, "/");
    try {
        const encoded = atob(base64)
            .split("")
            .map(char => char.charCodeAt(0).toString(16))
            .map(hex => `%${hex.padStart(2, "0").slice(-2)}`)
            .join("")

        return JSON.parse(decodeURIComponent(encoded)).obj;
    } catch {
        // return nothing
    }
}

function makeId(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {

    let ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    return { width: srcWidth*ratio, height: srcHeight*ratio };
}

const replaceSpecial = (data) => {
    let emojiRegex = /((?<!\\)<(a|):\w*:\d{18}>)/g;
    let normalEmojiRegex = '<d:EMOJI:>';
    let userRegex = /(?<!\\)(<@(!|)\d{18}>)/g;
    let roleRegex = /(?<!\\)(<@&\d{18}>)/g;
    let channelRegex = /(?<!\\)(<#\d{18}>)/g;

    if(!data || !data.raw) return '';
    if(!data.data) return data.raw;

    console.log(data);

    return data.raw
        .replace(emojiRegex, () => `<span class="emojiContainer-2XKwXX" role="button" tabindex="0"><img src="${data.data.shift()}" alt="emoji" draggable="false" class="emoji" data-type="emoji"></span>`)
        .replace(normalEmojiRegex, () => `<span class="emojiContainer-2XKwXX" role="button" tabindex="0"><img src="${data.data.shift()}" alt="emoji" draggable="false" class="emoji" data-type="emoji"></span>`)
        .replace(userRegex, () => `<span class="mention wrapper-1ZcZW- mention interactive" aria-controls="popout_211" aria-expanded="false" tabindex="0" role="button">@${data.data.shift()}</span>`)
        .replace(roleRegex, () => {
            let l = data.data.shift();
            return `<span class="roleMention-11Aaqi desaturate-_Twf3u wrapper-1ZcZW- mention" tabindex="-1" role="button" style="color: ${l.color}; background-color: rgba(44, 2, 149, 0.1);">@${l.name}</span>`
        })
        .replace(channelRegex, () => {
            let l = data.data.shift();
            if(l.text) return `<span class="wrapper-1ZcZW- iconMention-3WxjBe iconMentionText-1_WCtN mention interactive" role="link" tabindex="0"><svg width="24" height="24" viewBox="0 0 24 24" class="channelIcon-3I2O7O" aria-label="Channel"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z"></path></svg>${l.name}</span>`;
            return `<span class="wrapper-1ZcZW- iconMention-3WxjBe mention interactive" role="link" tabindex="0"><svg class="channelIcon-3I2O7O" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24" aria-label="Voice Channel"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M11.383 3.07904C11.009 2.92504 10.579 3.01004 10.293 3.29604L6 8.00204H3C2.45 8.00204 2 8.45304 2 9.00204V15.002C2 15.552 2.45 16.002 3 16.002H6L10.293 20.71C10.579 20.996 11.009 21.082 11.383 20.927C11.757 20.772 12 20.407 12 20.002V4.00204C12 3.59904 11.757 3.23204 11.383 3.07904ZM14 5.00195V7.00195C16.757 7.00195 19 9.24595 19 12.002C19 14.759 16.757 17.002 14 17.002V19.002C17.86 19.002 21 15.863 21 12.002C21 8.14295 17.86 5.00195 14 5.00195ZM14 9.00195C15.654 9.00195 17 10.349 17 12.002C17 13.657 15.654 15.002 14 15.002V13.002C14.551 13.002 15 12.553 15 12.002C15 11.451 14.551 11.002 14 11.002V9.00195Z" aria-hidden="true"></path></svg>${l.name}</span>`;
        });
}

const addAvatar = (avatarURL) => {
    let str = `<img id="user-avatar" src="${avatarURL}" aria-hidden="true" class="avatar-2e8lTP clickable-31pE3P" alt=" ">`;
    contentElement.innerHTML += str;
}

const addUsername = (username, time, robot, color) => {
    let created = moment(time).calendar();
    let str = `<h2 class="header-2jRmjb" aria-labelledby="message-username-943321998891831296 message-timestamp-943321998891831296"><span id="message-username-943321998891831296" class="headerText-2z4IhQ"><span id="user-username" class="username-h_Y3Us desaturateUserColors-1O-G89 clickable-31pE3P" aria-controls="popout_410" aria-expanded="false" role="button" tabindex="0" style="color: ${color ? color : '#FFFFFF'} !important;">${username}</span>${robot ? `<span id="user-bot-tag" class="botTagCozy-3NTBvK botTag-1NoD0B botTagRegular-kpctgU botTag-7aX5WZ rem-3kT9wc"><span class="botText-1fD6Qk">BOT</span></span>` : ''}</span><span class="timestamp-p1Df1m timestampInline-_lS3aK"><time><i class="separator-AebOhG" aria-hidden="true"> — </i>${created}</time></span></h2>`;
    contentElement.innerHTML += str;
}

const addContent = (content) => {
    contentElement.innerHTML += replaceSpecial(content);
}

const addAttachment = (URL, width, height) => {
    let ratio = calculateAspectRatioFit(width, height, 400, 400);

    let str = `<div class="messageAttachment-CZp8Iv"><a class="anchor-1MIwyf anchorUnderlineOnHover-2qPutX imageWrapper-oMkQl4 imageZoom-3yLCXY clickable-LksVCf embedWrapper-1MtIDg" tabindex="0" title="Image" href="${URL}" rel="noreferrer noopener" target="_blank" role="button" style="width: ${ratio.width}px; height: ${ratio.height}px;"><img alt="Image" style="width: ${ratio.width}px; height: ${ratio.height}px;" src="${URL}"></a></div>
`;
    messageAccessories.innerHTML += str;
}

let embed;
let embedFields;

const createEmbed = (color) => {
    embedFields = null;
    let id = makeId(10);
    let str = `<div class="embedWrapper-1MtIDg embedFull-1HGV2S embed-hKpSrO markup-eYLPri" style="border-left-color: ${color};" aria-hidden="false"><div id="${id}" class="grid-1aWVsE hasThumbnail-388RMe"></div></div>`
    messageAccessories.innerHTML += str;
    embed = document.getElementById(id);
}

const setAuthor = (username, avatar, url) => {
    let str = `<div class="embedAuthor-TJIHp5 embedMargin-2PsaQ4">${avatar ? `<img alt="" class="embedAuthorIcon-3pnkS4" src="${avatar}">` : ''}<a class="anchor-1MIwyf anchorUnderlineOnHover-2qPutX embedAuthorNameLink-1NK1y6 embedLink-1TLNja embedAuthorName-pGyUPR" tabindex="0" href="${url}" rel="noreferrer noopener" target="_blank" role="button">${username}</a></div>`;
    embed.innerHTML += str;
}

const setTitle = (title, url) => {
    let str = `<div class="embedTitle-2n1pEb embedMargin-2PsaQ4">${url ? `<a class="anchor-1MIwyf anchorUnderlineOnHover-2qPutX embedTitleLink-1QbYA- embedLink-1TLNja embedTitle-2n1pEb" tabindex="0" href="${url}" rel="noreferrer noopener" target="_blank" role="button">${title}</a>` : title}</div>`;
    embed.innerHTML += str;
}

const setDescription = (description) => {
    let str = `<div class="embedDescription-1DrJxZ embedMargin-2PsaQ4">${replaceSpecial(description)}</div>`;
    embed.innerHTML += str;
}

const addField = (name, value) => {
    if(!embedFields) {
        let id = makeId(10);
        let str = `<div class="embedFields-2yHGHT"><div id="${id}" class="embedField-2kda1Q" style="grid-column: 1 / 13;"></div></div>`;
        embed.innerHTML += str;
        embedFields = document.getElementById(id);
    }

    let str = `<div class="embedField-2kda1Q" style="grid-column: 1 / 13;"><div class="embedFieldName-9LYSyR">${name}</div><div class="embedFieldValue-3EHtvR">${replaceSpecial(value)}</div></div>`;
    embedFields.innerHTML += str;
}

const setThumbnail = (url) => {
    let str = `<a class="anchor-1MIwyf anchorUnderlineOnHover-2qPutX imageWrapper-oMkQl4 imageZoom-3yLCXY clickable-LksVCf embedThumbnail-2nTasl" tabindex="0" title="Image" href="${url}" rel="noreferrer noopener" target="_blank" role="button" style="width: 80px; height: 80px;"><img alt="Image" src="${url}" style="width: 80px; height: 80px;"></a>`;
    embed.innerHTML += str;
}

const setImage = (url) => {
    let str = `<a class="anchor-1MIwyf anchorUnderlineOnHover-2qPutX imageWrapper-oMkQl4 imageZoom-3yLCXY clickable-LksVCf embedWrapper-1MtIDg embedMedia-1mdWSP embedImage-2Ynqkh" tabindex="0" title="Image" href="${url}" rel="noreferrer noopener" target="_blank" role="button" style="width: 299px; height: 300px;"><img src="${url}" style="width: 299px; height: 300px;"></a>`;
    embed.innerHTML += str;
}

const setFooter = (text, image, time) => {
    let str = `<div class="embedFooter-3dj0UE embedMargin-2PsaQ4">${image ? `<img alt="" class="embedFooterIcon-1dTZzD" src="${image}">` : ''}<span class="embedFooterText-2Mc7H9">${text}${time ? `<span class="embedFooterSeparator-2YCzYT">•</span>${time}` : ''}</span></div>`;
    embed.innerHTML += str;
}

const addReaction = (url, count) => {
    let str = `<div><div class="reaction-2A2y9y" style="opacity: 1;"><div aria-controls="popout_413" aria-expanded="false"><div class="reactionInner-9eVHJa" aria-label="👀, 1 reaction, press to react" aria-pressed="true" role="button" tabindex="0"><img src="${url}" draggable="false" class="emoji" data-type="emoji"><div class="reactionCount-1zkLcN" style="min-width: 9px;">${count}</div></div></div></div></div>`;
    reactionElement.innerHTML += str;
}

async function preloader() {
    if(contentElement) {
        let loaded = base64Decode(params.data);
        console.log(loaded);
        addAvatar(loaded.author.avatar);
        addUsername(loaded.author.username, loaded.created, false, loaded.author.color);
        addContent(loaded.content);

        if(loaded.attachments) {
            for(let att of loaded.attachments) {
                addAttachment(att.url, att.width, att.height);
            }
        }

        if(loaded.embeds) {
            for(let embed of loaded.embeds) {
                createEmbed(embed.color);
                if(embed.author) setAuthor(embed.author.name, embed.author.icon_url, embed.author.url);
                if(embed.title) setTitle(embed.title, embed.url);
                if(embed.description) setDescription(embed.description);
                if(embed.thumbnail) setThumbnail(embed.thumbnail.url);
                if(embed.fields) {
                    for(let field of embed.fields) {
                        addField(field.name, field.value);
                    }
                }
                if(embed.image) setImage(embed.image.url);
                if(embed.footer) setFooter(embed.footer.text, embed.footer.icon_url, embed.timestamp ? embed.timestamp : null);
            }
        }

        if(loaded.reactions) {
            for(let reaction of loaded.reactions) {
                addReaction(reaction.url, reaction.count);
            }
        }
    }

    await html2canvas(document.querySelector("#capture")).then(canvas => {
        let img = canvas.toDataURL();
        let imgOutput = document.querySelector('#og-image');
        if(imgOutput) {
            imgOutput.content = img;
        }

        imgOutput = document.querySelector('#twitter-image');
        if(imgOutput) {
            imgOutput.content = img;
        }

        if(params.image) {
            document.write(img);
        }
    });
}

preloader();