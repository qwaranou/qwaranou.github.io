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
    contentElement.innerHTML += content;
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
    let str = `<div class="embedAuthor-TJIHp5 embedMargin-2PsaQ4"><img alt="" class="embedAuthorIcon-3pnkS4" src="${avatar}"><a class="anchor-1MIwyf anchorUnderlineOnHover-2qPutX embedAuthorNameLink-1NK1y6 embedLink-1TLNja embedAuthorName-pGyUPR" tabindex="0" href="${url}" rel="noreferrer noopener" target="_blank" role="button">${username}</a></div>`;
    embed.innerHTML += str;
}

const setTitle = (title, url) => {
    let str = `<div class="embedTitle-2n1pEb embedMargin-2PsaQ4">${url ? `<a class="anchor-1MIwyf anchorUnderlineOnHover-2qPutX embedTitleLink-1QbYA- embedLink-1TLNja embedTitle-2n1pEb" tabindex="0" href="${url}" rel="noreferrer noopener" target="_blank" role="button">${title}</a>` : title}</div>`;
    embed.innerHTML += str;
}

const setDescription = (description) => {
    let str = `<div class="embedDescription-1DrJxZ embedMargin-2PsaQ4">${description}</div>`;
    embed.innerHTML += str;
}

const addField = (name, value) => {
    if(!embedFields) {
        let id = makeId(10);
        let str = `<div class="embedFields-2yHGHT"><div id="${id}" class="embedField-2kda1Q" style="grid-column: 1 / 13;"></div></div>`;
        embed.innerHTML += str;
        embedFields = document.getElementById(id);
    }

    let str = `<div class="embedField-2kda1Q" style="grid-column: 1 / 13;"><div class="embedFieldName-9LYSyR">${name}</div><div class="embedFieldValue-3EHtvR">${value}</div></div>`;
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

if(contentElement) {
    let loaded = base64Decode(params.data);
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
            setAuthor(embed.author.name, embed.author.icon_url, embed.author.url);
            setTitle(embed.title, embed.url);
            setDescription(embed.description);
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