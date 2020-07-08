
// DISCORD

client.on('ready', () => {
    console.log('ON');
});

setInterval(() => {
    userIds = Object.keys(db.data.users)
    userPoints = []
    final = []
    for(i = 0;i < userIds.length;i++) {
        userPoints.push([db.data.users[userIds[i]].xp])

    }
    userPoints.sort(function(a, b){return b-a});

    for(z=0; z < userPoints.length;z++) {
        for(i=0; i< userIds.length;i++) {
          
              if(db.data.users[userIds[i]].xp == userPoints[z]) {
                set = async function(userid,points){
                  
                let usr = await client.users.fetch(userIds[i])
                
                let name = usr.username + "#" + usr.discriminator
                let avatar = usr.avatar

                final.push([userid, parseInt(points), name, avatar])

              }
                set(userIds[i],userPoints[z])
            }
            }
          
        
    }
  
  var teste = setInterval(() => {
    if(final.length/2 > userIds.length) {
      leaderB.set('leaderboard', final)
       clearInterval(teste);
    }
    
  }, 1000);
  

  
}, 60000);


client.on('raw', async event => {
  if(!events.hasOwnProperty(event.t)) return;
  const { d: data } = event;
  const user = client.users.cache.get(data.user_id);
  const channel = client.channels.cache.get(data.channel_id);
  const message = await channel.messages.fetch(data.message_id);
  const member = message.guild.members.cache.get(user.id);
  const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;

  let reaction = message.reactions.cache.get(emojiKey);
  


  if(data.channel_id == 675756903879540768) {
    if(event.t === "MESSAGE_REACTION_ADD") {
      let roleMembro = message.guild.roles.cache.get("541256122032455701");
      let roleCores = message.guild.roles.cache.get("655170188215320586");
      let roleCargos = message.guild.roles.cache.get("655169819980595286");
      let roleTags = message.guild.roles.cache.get("655170326984130575");

      member.roles.add(roleMembro).then(() =>
      member.roles.add(roleCores)).then(() =>
      member.roles.add(roleCargos)).then(() =>
      member.roles.add(roleTags))
      
    }
  }
})


client.on('guildMemberAdd', member => {// gambiarra 
  
  let fotodoperfil = member.user.avatarURL({format: 'png'})
  nome = member.user.tag
  time = (new Date().getTime());

    jimp.read('https://cdn.glitch.com/2ea3003b-ca26-453a-83a3-26dbedd90e2e%2Ffundo_transparente.png?v=1583353888507', (err, img) => {
        if (err) throw err;
        jimp.read(fotodoperfil, (err, img1) => {
            if (err) throw err;
            img1.resize(350, 350)
            img.composite(img1, 20, 20)
            img.write('./edit1' + time + '.png', function() {
                console.log("edit completo")
                jimp.read('./edit1' + time + '.png', (err, img3) => {
                    if (err) throw err;
                    jimp.read('https://cdn.glitch.com/2ea3003b-ca26-453a-83a3-26dbedd90e2e%2Fbem_vindo.png?v=1583353888825', (err, img4) => {
                        if (err) throw err;
                        img3.composite(img4, 0, 0)
                        img3.write('./pronto' + time + '.png', function() {
                            console.log("pronto")
                            fs.writeFileSync('nome' + time + '.png', text2png(nome, {
                                localFontName: 'UniSansThinCAPS',
                                color: 'rgb(54, 57, 63)',
                                font: '45px sans-serif'
                            }))
                            jimp.read('./pronto' + time + '.png', (err, img3) => {
                                if (err) throw err;
                                jimp.read('./nome' + time + '.png', (err, img4) => {
                                    if (err) throw err;
                                    if (img4.bitmap.width >= 350) x = 400
                                    if (img4.bitmap.width <= 349) x = 440
                                    img3.composite(img4, x, 180)
                                    img3.write('./jaja' + time + '.png', function() {
                                      member.guild.channels.cache.get('597160061915234321').send('<@'+ member.user.id + ">, **Bem Vindo!**", { files: ['./jaja' + time + '.png'] })
                                      
                                      setTimeout(() => {
                                      fs.unlink('new' + time + '.png', function(err) {
                                     });
                                      fs.unlink('./edit1' + time + '.png', function(err) {
                                     });
                                      fs.unlink('./pronto' + time + '.png', function(err) {
                                     });
                                      fs.unlink('nome' + time + '.png', function(err) {
                                     });
                                      fs.unlink('./jaja' + time + '.png', function(err) {
                                     });
                                      }, 3000);
                                      
                                      
                                    })
                                })
                            })
                        })
                    })
                })

            })
        })
    })
});


client.on("message", async message => {
  
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  
    if (message.content.startsWith(prefix + 'ban')) { //------------banir
      if (message.author.bot) return;
        let mAuthor = message.author;
        if (!message.guild.member(mAuthor).hasPermission("ADMINISTRATOR")) return message.reply('**Você não tem a permissão necessária para usar este comando.**');
        let member = message.mentions.members.first();
        if (!member) return message.reply("**Por favor, mencione um membro válido deste servidor**");
        if (!member.bannable) return message.reply("**Não posso banir esse usuário! Ele têm um cargo maior ou eu não tenho permissão**");
        let reason = args.slice(1).join(' ');
        if (!reason) return message.reply("**Indique um motivo para o banir " + member.user.tag + "**");
        await member.ban(reason)
            .catch(error => message.reply('Desulpe' + message.author + 'Eu não posso banir por causa de:' + error));
        var logChann = message.guild.channels.cache.find(channels => channels.name == '◆》log');
        const msg = new Discord.MessageEmbed()
            .setColor(0xEE2A00)
            .setAuthor('Banido', client.user.avatarURL())
            .setDescription('<@' + member.user.id + ">")
            .setThumbnail(member.user.avatarURL())
            .addField('Banido Por', '<@' + message.author.id + ">")
            .addField('Motivo', reason)
            .setTimestamp()
            .setFooter('Criado por Felipe GM', lilpump);
        logChann.send(msg)
        message.reply(msg)

    }
/*
    if (message.content.startsWith(prefix + 'desmutar')) {
      if (message.author.bot) return;
        let mAuthor = message.author;
        let member = message.mentions.members.first();
        let muteRole = message.guild.roles.find("name", "Mutado");
        let memberRole = message.guild.roles.find("name", "Membro");
        let erroms = message.content.split(" ").slice(1);
        if (!message.guild.member(mAuthor).hasPermission("MANAGE_MESSAGES")) return message.reply('**Você não tem a permissão necessária para usar este comando.**');
        if(!member.roles.find(r => r.name === "Mutado")) return message.reply(member + " **Não esta mutado**");
        if (!member) return message.reply("**Por favor, mencione um membro válido deste servidor**");
        if (!muteRole) return message.reply("**Você precisa de um cargo \"mutado\" em seu servidor**")
        member.removeRole(muteRole.id);
        member.addRole(memberRole.id);

        const msg = new Discord.MessageEmbed()
            .setColor(0xEE2A00)
            .setAuthor('Desmutado', client.user.avatarURL)
            .setDescription('<@' + member.user.id + '>')
            .setThumbnail(member.user.avatarURL)
            .addField('Desmutado Por', '<@' + message.author.id + '>')
            .setTimestamp()
            .setFooter('Criado por Felipe GM', lilpump);
        message.channel.send(msg);

    }*/
  if(message.content == prefix + "2021") {
    let reamingMS = 1609470000000 - Date.now()
        let date = formatDuration(reamingMS)
        date += ", Até o ano novo"

        embed = new Discord.MessageEmbed()
                .setTitle(date)
                .setColor('#24f000')

        message.channel.send({embed})
  }
  
  if(message.content == prefix + "top") {
    //message.channel.send("> " + message.author.username + ", Comando desativado temporariamente")
    
        var userPos,txtDesc = "";
        for(i=0;i<leaderB.data.leaderboard.length;i++) {
            if(leaderB.data.leaderboard[i][0] == message.author.id) {
                userPos = parseInt(i+1)
                break
            }
        }

        const embed = new Discord.MessageEmbed()
        .setTitle("Leaderboard")
        .setAuthor("Kuruminha", client.user.avatarURL())
        .setColor('0x00AE86')
        .addField("Para mais informações", "[Brasil Império](https://brasil-imperio.glitch.me/Ranking/)")
        .addField("Você", "> __" + userPos + "º " + message.author.username + "__ - **XP: " + db.data.users[message.author.id].xp + "**" )
        .setFooter("Criado por GM#0001", "https://cdn.discordapp.com/avatars/319606741639757824/a_8f9382251f58a6ef69f2aad5c5ab1a69.gif")
        .setThumbnail(client.user.avatarURL())
        .setTimestamp()

        for(i = 0; i < 10;i++) {

            if(i == 0) pos = "<a:1_:668271848068350002>"
            if(i == 1) pos = "<a:2_:668271869417488407>"
            if(i == 2) pos = "<a:3_:668271880569880576>"
            if(i > 2) pos = "  " + parseInt(i+1)

            txtDesc = txtDesc + "**" + pos + " - <@" + leaderB.data.leaderboard[i][0] + ">** - ``" + leaderB.data.leaderboard[i][1] + "``\n"
        
        }

        embed.setDescription(txtDesc)
        message.channel.send({embed})

    }

    if (message.content.startsWith(prefix + 'addtag')) {
      let mention = message.mentions.members.first();
      if (mention) return message.reply("**Essa tag não é permitida**")

        if (message.content.length > 900) return message.reply("** Limite de caracteres excedido, **``" + message.content.length + '``').then((message) =>
        setTimeout(() => {
            message.delete()
        }, 7000));

      if (message.author.bot) return;
        let tagname = args[0]
        let tag = args.slice(1).join(' ');

        if (edittaglist.data.tags[tagname]) return message.reply("**" + tagname + " Já existe**")
        if (!tagname) return message.reply("***Exemplo:*** **>addtag [Nome da tag] [text]**")
        if (!tag) return message.reply("***Exemplo:*** **>addtag [**``" + tagname + "``**] [text]**")
        message.reply("**" + tagname + ", Adicionado 👍**")

        edittaglist.set("tags." + tagname, tag)
        edittaglist.save()
    }

    if (message.content.startsWith(prefix + 'tag')) {
      if(message.content.startsWith(prefix + 'tagadd')) return message.reply("***Exemplo:*** **>addtag [Nome da tag] [text]**")
      if (message.author.bot) return;
        var tagname = args[0]
        if(!tagname) return message.reply("***Exemplo:*** **>tag [Nome da tag]**")
        if (!edittaglist.data.tags[tagname]) return message.reply("**Essa tag não existe**")
        if(edittaglist.data.tags[tagname].indexOf("<@") > -1) return message.reply("**tag de corno q quer pingar os outros essa ai**")
        message.channel.send(edittaglist.data.tags[tagname])
    }

    if(message.content.startsWith(prefix + 'roll')) {
      if (message.author.bot) return;
        let reason = args.slice(0).join(' ');
        if(!reason) return message.channel.send("**Exemplo: >roll [text]**")
        var random = Math.floor(Math.random() * lista.length)
        message.reply('**' + lista[random] + '**')
    }
  
    if (message.content.startsWith(prefix + 'removertag')) {
      if (message.author.bot) return;
        let mAuthor = message.author;
        var tagname = args[0]
        if (!message.guild.member(mAuthor).hasPermission("MANAGE_MESSAGES")) return message.reply('**Você não tem a permissão necessária para usar este comando.**');
        if (!edittaglist.data[tagname]) return message.reply("**Essa tag não existe**")
        edittaglist.unset(tagname)
        edittaglist.save()
        message.reply("**tag removida 👍**")
    }
/*
    if (message.content.startsWith(prefix + 'mutar')) {
      if (message.author.bot) return;
        let mAuthor = message.author;
        let member = message.mentions.members.first();
        let muteRole = message.guild.roles.find("name", "Mutado");
        let memberRole = message.guild.roles.find("name", "Membro");

        let erroms = message.content.split(" ").slice(1);
        if (!message.guild.member(mAuthor).hasPermission("MANAGE_MESSAGES"))
          return message.reply('**Você não tem a permissão necessária para usar este comando.**');
        if(member.roles.find(r => r.name === "Mutado")) return message.reply(member + " **Já esta mutado**");
        if (!member) return message.reply("**Por favor, mencione um membro válido deste servidor**");
        if (!muteRole) return message.reply("**Você precisa de um cargo \"mutado\" em seu servidor**")
        member.addRole(muteRole.id);
        member.removeRole(memberRole.id);

        const msg = new Discord.MessageEmbed()
            .setColor(0xEE2A00)
            .setAuthor('mutado', client.user.avatarURL)
            .setDescription('<@' + member.user.id + ">")
            .setThumbnail(member.user.avatarURL)
            .addField('mutado Por', '<@' + message.author.id + ">")
            .setTimestamp()
            .setFooter('Criado por Felipe GM', lilpump);
        message.channel.send(msg);
        client.channels.get("632973458908774419").send(msg)

    }
*/
    if (message.content.startsWith(prefix + 'clear')) {
      if (message.author.bot) return;
        async function purge() {
            let mAuthor = message.author;
            if (!message.guild.member(mAuthor).hasPermission("ADMINISTRATOR"))
                return message.reply('Você não tem permissão para usar este comando.');
            if (isNaN(args[0]) || +args[0] > 100 || +args[0] < 2)
                return message.channel.send('**Use um número de 2 a 100** \n\n ``use: \>clear\ <2-100>``');

            message.delete();
            const fetched = await message.channel.messages.fetch({
                limit: args[0]
            });
            message.channel.bulkDelete(fetched).catch(error => message.channel.send(`Error: ${error}`));
            message.channel.send("__" + fetched.size + '__ **Mensagens foram deletadas, Por: ' + mAuthor + '**').then((message) => {
                setTimeout(() => {
                    message.delete()
                }, 7000);
            })

        }
        purge();
    }

    if (message.content.startsWith(prefix + 'ping')) { //------------ping
    let author = message.author.tag
    var startTime = Date.now();
if (message.author.bot) return;
    message.channel.send("Ping").then((message) => {
        let endTime = Date.now();
        let ping = Math.round(endTime - startTime)
        let rounded = ping / 1000
        message.edit({
            embed: new Discord.MessageEmbed()
                .setColor(0x17A589)
                .addField('Seu Ping', ping + " Ms",true)
                .addField('Bot Ping', Math.round(client.ping) + " Ms",true)
                .setTimestamp()
                //.setFooter('Stats: Ram: ' + getMemoryUsage() + "MB" + ", Cpu: 1%", lilpump)
        })
    })
  }
  
  if (message.content == '<@560297435960705026>') {
    message.channel.send("**Meu prefixo: **``>``")
  }
  
  if(message.content.startsWith(prefix + 'vote')) message.react('👍').then(() => message.react('👎'));
  
  if(message.channel.id == "578683924591673360") {
       message.react('👍').then(() => message.react('👎'));
  }
  /*if(message.channel.id == "630139959432708107") {
    var Attachment = (message.attachments).array();
    if (Attachment.length > 0) message.react('👍').then(() => message.react('👎'));
  }*/
  
  if (message.content.startsWith(prefix +'avatar')) {//------------avatar
      const embed = new Discord.MessageEmbed()
        .setTitle(message.author.username)
        .setImage(message.author.avatarURL())
      message.channel.send({embed});
    }
  
  var count = Object.keys(edittaglist.data.tags).length,
  totaltag = Object.keys(edittaglist.data.tags),
  numeroList = 0,
  pagina = args[0];
  
if (message.content.startsWith(prefix + "listtag")) {
  if (message.author.bot) return;
    if (!pagina) return message.reply("**Exemplo: >taglist [1]**")
    numeroList = pagina + 0
    if (numeroList == 00) numeroList = 0
    const embed = new Discord.MessageEmbed()
        .setTitle("Tag list")
        .setColor(0x00AE86)
        .setTimestamp()
    var sehloiro = "/ "

    embed.setFooter("Paginas: " + sehloiro + "Total Tags: " + count)
    var brabo = 0
    for (i = numeroList; i < count; i++) {
        brabo++
        if (brabo == 11) return message.channel.send({embed});
        var tagname = totaltag[i].substring(0, 10)
        var taginteira = edittaglist.data.tags[totaltag[i]].substring(0, 20)
        embed.addField(tagname, taginteira, true);
    }

}

  const linkproib = [`discord.gg`,`discord .gg /`, `discord.gg /`, `discord .gg/`, `discord .gg`, `discord . gg`, `discord. gg`, `discord gg`, `discordgg`, `discord gg /`,`discord.io/`,`discord.io`,`.onion`]
    try {
        if (linkproib.some(word => message.content.toLowerCase().includes(word))) {
            if (message.author.id === message.guild.ownerID) return;
             message.delete();
             message.reply('**Você não pode enviar esse link aqui**');
        }
    } catch (e) {
        console.log(e);
    }

    if(message.author.id == "405480380930588682" ){
        const proib = [`cory`,`dratini`,`asuma`]

    if(message.embeds.length > 0){
        titulo = message.embeds[0].title
    try {
        if (proib.some(word => titulo.includes(word))) {

             message.delete();
             message.channel.send('**Sem [💩 emf 💩] aqui irmão 👍**');
        }
    } catch (e) {
        console.log(e);
    }
    }
}
  
    if(channelsBloq.indexOf(message.channel.id) >= 0) return
    if (message.author.bot) return
    if(cooldown.indexOf(message.author.id) == -1) {
    if(message.content == "�") return
    if(message.content.indexOf("<") == 0 && message.content[message.content.length - 1] == ">") return
    if(message.content.indexOf(":") == 0 && message.content[message.content.length - 1] == ":") return
    if(message.content.length < 6) return
        
    let xpADD = Math.floor(Math.random() * 5 + 6)
        saveDB(message.author,xpADD)
        cooldown.push(message.author.id)
        setTimeout(() => {
            delete cooldown[cooldown.indexOf(message.author.id)]
        }, 60000);
    }
  
});
/*
client.on("message", message => {funcionava na versão 11(eu acho q é 11 n lembro) do discord.js, na atualização parou de funcionar por algum update e eu fiquei com preguiça de arrumar
  var content;
    if(message.author.id == client.user.id) return;
    var countingChannel = message.channel.name;
    if(countingChannel == '🔢▏counting') {
      if (message.author.bot) message.delete()
        var content = message.content;
        // isnan // true = letter // false = number;
        var isNumber = isNaN(content);
        if(isNumber == true) return message.delete(1000);
        message.channel.messages.fetch({limit: 2})
        .then(MEUCACETE => {
            var oldnum = MEUCACETE.last().content;
            var oldauthor = MEUCACETE.last().author.id;
            var newAuthor = MEUCACETE.first().author.id;
            if(oldauthor == newAuthor) return message.delete(100)
            if(message.content != oldnum * 1 + 1) return message.delete(100)
            setTopic(message.content);
                        
            function setTopic(content) {
            if(countingChannel == '🔢▏counting') {// da pra melhorar esse setTopic, eu tava com preguiça
            if(message.content == 100) return message.channel.setTopic('Congratulations: <@' + message.author.id + '>' + ' | arrived at: ' + content);
            if(message.content == 200) return message.channel.setTopic('Congratulations: <@' + message.author.id + '>' + ' | arrived at: ' + content);
            if(message.content == 300) return message.channel.setTopic('Congratulations: <@' + message.author.id + '>' + ' | arrived at: ' + content);
            if(message.content == 400) return message.channel.setTopic('Congratulations: <@' + message.author.id + '>' + ' | arrived at: ' + content);
            if(message.content == 500) return message.channel.setTopic('Congratulations: <@' + message.author.id + '>' + ' | arrived at: ' + content);
            if(message.content == 600) return message.channel.setTopic('Congratulations: <@' + message.author.id + '>' + ' | arrived at: ' + content);
            if(message.content == 700) return message.channel.setTopic('Congratulations: <@' + message.author.id + '>' + ' | arrived at: ' + content);
            if(message.content == 800) return message.channel.setTopic('Congratulations: <@' + message.author.id + '>' + ' | arrived at: ' + content);
            if(message.content == 900) return message.channel.setTopic('Congratulations: <@' + message.author.id + '>' + ' | arrived at: ' + content);
            if(message.content == 1000) return message.channel.setTopic('Congratulations: <@' + message.author.id + '>' + ' | arrived at: ' + content);
            if(message.content == 1100) return message.channel.setTopic('Congratulations: <@' + message.author.id + '>' + ' | arrived at: ' + content);
            if(message.content == 1200) return message.channel.setTopic('Congratulations: <@' + message.author.id + '>' + ' | arrived at: ' + content);
            if(message.content == 1300) return message.channel.setTopic('Congratulations: <@' + message.author.id + '>' + ' | arrived at: ' + content);
            if(message.content == 1400) return message.channel.setTopic('Congratulations: <@' + message.author.id + '>' + ' | arrived at: ' + content);
            if(message.content == 1500) return message.channel.setTopic('Congratulations: <@' + message.author.id + '>' + ' | arrived at: ' + content);
            if(message.content == 1600) return message.channel.setTopic('Congratulations: <@' + message.author.id + '>' + ' | arrived at: ' + content);
            if(message.content == 1700) return message.channel.setTopic('Congratulations: <@' + message.author.id + '>' + ' | arrived at: ' + content);
            if(message.content == 1800) return message.channel.setTopic('Congratulations: <@' + message.author.id + '>' + ' | arrived at: ' + content);
            if(message.content == 1900) return message.channel.setTopic('Congratulations: <@' + message.author.id + '>' + ' | arrived at: ' + content);
            if(message.content == 2000) return message.channel.setTopic('Congratulations: <@' + message.author.id + '>' + ' | arrived at: ' + content);
            if(message.content == 2100) return message.channel.setTopic('Congratulations: <@' + message.author.id + '>' + ' | arrived at: ' + content);
            if(message.content == 2200) return message.channel.setTopic('Congratulations: <@' + message.author.id + '>' + ' | arrived at: ' + content);
            if(message.content == 2300) return message.channel.setTopic('Congratulations: <@' + message.author.id + '>' + ' | arrived at: ' + content);
            if(message.content == 2400) return message.channel.setTopic('Congratulations: <@' + message.author.id + '>' + ' | arrived at: ' + content);
            if(message.content == 2500) return message.channel.setTopic('Congratulations: <@' + message.author.id + '>' + ' | arrived at: ' + content);
            if(message.content == 2600) return message.channel.setTopic('Congratulations: <@' + message.author.id + '>' + ' | arrived at: ' + content);
            //message.channel.setTopic("The actual number is: " + content);
            }
          }
        })
        .catch()
    }
})

client.on('messageDelete', function(message) {
    if(message.channel.type == 'text') {

            var logChann = message.guild.channels.cache.find(channels => channels.name == '◆》log');
            const msg = new Discord.MessageEmbed()
            .setColor(0xEE2A00)
            .setAuthor('Mensagem Deletada', message.author.avatarURL)
            .setDescription('**Autor: **<@' + message.author.id + '>, **Canal: **<#' + message.channel.id + "> \n\n**Mensagem: **" + message)
            .setTimestamp()
            .setFooter('Criado por Felipe GM', lilpump);
            logChann.send(msg)

    }
});

client.on('messageUpdate', function(oldMessage, newMessage) {
  console.log(oldMessage, newMessage)
    if (newMessage.channel.type == 'text' && newMessage.cleanContent != oldMessage.cleanContent) {
      var membrChann = newMessage.guild.channels.cache.find(channels => channels.name == '🍻chat');
        if(newMessage.channel.id == 668193850568867854) newMessage.delete(), newMessage.author.send("Você não pode editar mensagens nesse canal");
        var logChann = newMessage.guild.channels.cache.find(channels => channels.name == '◆》log');
            const msg = new Discord.MessageEmbed()
            .setColor(0xEE2A00)
            .setAuthor('Mensagem Editada', newMessage.author.avatarURL)
            .setDescription('**Autor: **<@' + newMessage.author.id + '>, **Canal: **<#' + newMessage.channel.id + "> \n\n**Antes: **" + oldMessage + " \n **Depois: **" + newMessage)
            .setTimestamp()
            .setFooter('Criado por Felipe GM', lilpump);
            logChann.send(msg)
    }

});*/

client.on('guildBanRemove', function(guild, user) {

      var logChann = guild.channels.cache.find(channels => channels.name == '◆》log');
            const msg = new Discord.MessageEmbed()
            .setColor(0xEE2A00)
            .setAuthor('Usuario Desbanido', user.avatarURL())
            .setDescription('**Usuario: **<@' + user.id + '>')
            .setTimestamp()
            .setFooter('Criado por Felipe GM', lilpump);
            logChann.send(msg)

});

client.on("channelDelete", function(channel){

    var logChann = channel.guild.channels.cache.find(channels => channels.name == '◆》log');
    const msg = new Discord.MessageEmbed()
    .setColor(0xEE2A00)
    .setAuthor('Canal Deletado', client.user.avatarURL())
    .setDescription('**Canal: **' + channel)
    .setTimestamp()
    .setFooter('Criado por Felipe GM', lilpump);
    logChann.send(msg)

});

function saveDB(user, xp) {
    var d = new Date();
    var n = d.getTime();
    if (!db.data.users[user.id]) {
        db.set('users.' + user.id, {'xp': xp,'evento': 0})
    } else {
        db.set('users.' + user.id, {'xp': db.data.users[user.id].xp + xp,'evento': db.data.users[user.id].evento})
    }
}

client.on('message', message => {
  if (message.author.bot) return;
    let prefix = ">";
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const game = args[1]
    if (message.content.startsWith(prefix + "check")) {
        if(!game) return message.reply("** PixelZone use >check pz, PixelPlanet use >check pp**")
        console.log(game)
        var Attachment = (message.attachments).array();
        if (Attachment.length == 0) return message.reply("**Você deve enviar uma imagem**");
        // Get the attachment url
        var url = Attachment[0].url;
        var check = url.endsWith(".png");
        if(check == false) return message.reply("**Você deve enviar uma imagem .PNG**");
        // Downloading the image
      if(Attachment[0].height > 800) return message.reply("**Template muito grande, limite 800x800**")
      if(Attachment[0].width > 800) return message.reply("**Template muito grande, limite 800x800**")
        var certos = 0;
        var errados = 0;
        var pixeis = 0;
        var x;
        var y;
        var time = (new Date()).getTime();
        jimp.read(url, function(err, image) {
            for (y = 0; y < image.bitmap.height; y++) {
                for (x = 0; x < image.bitmap.width; x++) {
                    pixeis++;
                    let tamanho = image.bitmap.height * image.bitmap.width;
                    var cinza = jimp.rgbaToInt(228, 228, 228, 255);
                    if (pixeis >= tamanho) {
                        image.write('./templates/' + time + '1.png', function (err) {
                          if (err) throw err;
                          console.log('Feito');
                        });
                        console.log("Response in: " + (new Date().getTime() - message.createdTimestamp))
                        if (errados == 0) message.reply("**Não há erros**");
                        else {
                            setTimeout(() => {
                                message.reply(errados + "/" + tamanho + ', Erros/Tamanho da imagem', {
                                    files: [{
                                        attachment: './templates/' + time + '1.png',
                                        name: 'wrongColors.png'
                                    }]
                                });
                            }, 1500);
                        };
                        setTimeout(() => {
                            fs.unlink('./templates/' + time + '1.png', function(err) {
                                if (err) console.log(err);
                            });
                        }, 5000);
                      console.log(errados);
                    }
                    let color1 = JSON.stringify(Pjimp.intToRGBA(image.getPixelColor(x, y)));
                    if(game == 'pz') var color = getColorIDPZone(JSON.stringify(jimp.intToRGBA(image.getPixelColor(x, y))));
                    if(game == 'pp') var color = getColorIDPPlanet(JSON.stringify(jimp.intToRGBA(image.getPixelColor(x, y))));
                    //console.log(color);
                    if (color == -1) {
                        errados++;
                        var vermelho = jimp.rgbaToInt(255, 0, 0, 255);
                        image.setPixelColor(vermelho, x, y);
                    } else {
                        if (color == -2) continue;
                        var colorjson = jimp.intToRGBA(image.getPixelColor(x, y));
                        var transparente = jimp.rgbaToInt(colorjson.r, colorjson.g, colorjson.b, 50);
                        image.setPixelColor(transparente, x, y);
                    };
                }
             
            }
        });
        function getColorIDPZone(rgb) {// não use essa função nunca, só usei pq foi ctrl + c, usa uma array ou objeto mto melhor
            switch (rgb) {
                case '{"r":38,"g":38,"b":38,"a":255}':
                    return 0;
                    break;
                case '{"r":0,"g":0,"b":0,"a":255}':
                    return 1;
                    break;
                case '{"r":128,"g":128,"b":128,"a":255}':
                    return 2;
                    break;
                case '{"r":255,"g":255,"b":255,"a":255}':
                    return 3;
                    break;
                case '{"r":153,"g":98,"b":61,"a":255}':
                    return 4;
                    break;
                case '{"r":255,"g":163,"b":200,"a":255}':
                    return 5;
                    break;
                case '{"r":207,"g":115,"b":230,"a":255}':
                    return 6;
                    break;
                case '{"r":128,"g":0,"b":128,"a":255}':
                    return 7;
                    break;
                case '{"r":229,"g":0,"b":0,"a":255}':
                    return 8;
                    break;
                case '{"r":299,"g":137,"b":0,"a":255}':
                    return 9;
                    break;
                case '{"r":229,"g":229,"b":0,"a":255}':
                    return 10;
                    break;
                case '{"r":150,"g":230,"b":70,"a":255}':
                    return 11;
                    break;
                case '{"r":0,"g":190,"b":0,"a":255}':
                    return 12;
                    break;
                case '{"r":0,"g":230,"b":230,"a":255}':
                    return 13;
                    break;
                case '{"r":0,"g":136,"b":204,"a":255}':
                    return 14;
                    break;
                case '{"r":0,"g":0,"b":230,"a":255}':
                    return 15;
                    break;
                    // transparent
                case '{"r":0,"g":0,"b":0,"a":0}':
                    return -2;
                    break;
                    // none of the other colors
                default:
                    return -1;
                    break;
            }
        }

        function getColorIDPPlanet(rgb) {
            switch (rgb) {
                case '{"r":255,"g":255,"b":255,"a":255}':
                    return 2;
                    break;
      
                case '{"r":228,"g":228,"b":228,"a":255}':
                    return 3;
                    break;
      
                case '{"r":136,"g":136,"b":136,"a":255}':
                    return 4;
                    break;
      
                case '{"r":78,"g":78,"b":78,"a":255}':
                    return 5;
                    break;
      
                case '{"r":0,"g":0,"b":0,"a":255}':
                    return 6;
                    break;
      
                case '{"r":244,"g":179,"b":174,"a":255}':
                    return 7;
                    break;
      
                case '{"r":255,"g":167,"b":209,"a":255}':
                    return 8;
                    break;
      
                case '{"r":255,"g":101,"b":101,"a":255}':
                    return 9;
                    break;
                
                case '{"r":229,"g":0,"b":0,"a":255}':
                    return 10;
                    break;
      
                case '{"r":254,"g":164,"b":96,"a":255}':
                    return 11;
                    break;
      
                case '{"r":229,"g":149,"b":0,"a":255}':
                    return 12;
                    break;
      
                case '{"r":160,"g":106,"b":66,"a":255}':
                    return 13;
                    break;
      
                case '{"r":245,"g":223,"b":176,"a":255}':
                    return 14;
                    break;   
      
                case '{"r":229,"g":217,"b":0,"a":255}':
                    return 15;
                    break;  
      
                case '{"r":148,"g":224,"b":68,"a":255}':
                    return 16;
                    break;  
      
                case '{"r":2,"g":190,"b":1,"a":255}':
                    return 17;
                    break; 
      
                case '{"r":0,"g":101,"b":19,"a":255}':
                    return 18;
                    break; 
      
                case '{"r":202,"g":227,"b":255,"a":255}':
                    return 19;
                    break; 
      
                case '{"r":0,"g":211,"b":221,"a":255}':
                    return 20;
                    break; 
      
                case '{"r":0,"g":131,"b":199,"a":255}':
                    return 21;
                    break; 
      
                case '{"r":0,"g":0,"b":234,"a":255}':
                    return 22;
                    break; 
      
                case '{"r":25,"g":25,"b":115,"a":255}':
                    return 23;
                    break; 
      
                case '{"r":207,"g":110,"b":228,"a":255}':
                    return 24;
                    break; 
      
                case '{"r":130,"g":0,"b":128,"a":255}':
                    return 25;
                    break; 
      
                case '{"r":0,"g":0,"b":0,"a":0}':
                    return -2;
                    break;
      
                case '{"r":255,"g":255,"b":255,"a":255}':
                    return -2;
                    break; 
      
                case '{"r":255,"g":255,"b":255,"a":0}':
                    return -2;
                    break;
      
                default:
                    return -1;
                    break;
                    
            }

    }
}

});


function parseDuration(duration) {
    let remain = duration
  
    let days = Math.floor(remain / (1000 * 60 * 60 * 24))
    remain = remain % (1000 * 60 * 60 * 24)
  
    let hours = Math.floor(remain / (1000 * 60 * 60))
    remain = remain % (1000 * 60 * 60)
  
    let minutes = Math.floor(remain / (1000 * 60))
    remain = remain % (1000 * 60)
  
    let seconds = Math.floor(remain / (1000))
    remain = remain % (1000)
  
    let milliseconds = remain
  
    return {
        days,hours,minutes,seconds,milliseconds
    };
  }
  
  function formatTime(o, useMilli = false) {
    var parts = []
    if (o.days) {
      let ret = o.days + ' Dia'
      if (o.days !== 1) {
        ret += 's'
      }
      parts.push(ret)
    }
    if (o.hours) {
      let ret = o.hours + ' Hora'
      if (o.hours !== 1) {
        ret += 's'
      }
      parts.push(ret)
    }
    if (o.minutes) {
      let ret = o.minutes + ' Minuto'
      if (o.minutes !== 1) {
        ret += 's'
      }
      parts.push(ret)
  
    }
    if (o.seconds) {
      let ret = o.seconds + ' Segundo'
      if (o.seconds !== 1) {
        ret += 's'
      }
      parts.push(ret)
    }
    if (useMilli && o.milliseconds) {
      let ret = o.milliseconds + ' millisecond'
      if (o.milliseconds !== 1) {
        ret += 's'
      }
      parts.push(ret)
    }
    if (parts.length === 0) {
      return 'instantly'
    } else {
      return parts.join(' ')
    }
  }
  
  function formatDuration(duration, useMilli = false) {
    let time = parseDuration(duration)
    return formatTime(time, useMilli)
  }



client.login("TOKEN HERE")
