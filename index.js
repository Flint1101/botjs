const Discord = require('discord.js')

const client = new Discord.Client()

const { token, prefix } = require('./config.json')
const roleClaim = require('./commands/auto_role.js');

const { readdirSync } = require('fs');

const { join } = require('path');
const { send } = require('process');
const { create } = require('domain');

client.commands= new Discord.Collection();

const commandFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"));

for (const file of commandFiles)
{
    const command = require(join(__dirname, "commands", `${file}`));
    client.commands.set(command.name, command);
}
client.on("error", console.error);

client.on('ready', () =>
{
    console.log("I'm Ready Sir");

    client.user.setActivity("3 RANDURI DI CRIIER");

    roleClaim(client)
})

client.on("message", async message => 
{
    if(message.author.bot) return;
    if(message.author.type === 'dm') return;

    if(message.content.includes('prefix'))
        return message.channel.send(createEmbed("Bot Prefix", "My prefix is **ion**", "#0aa321")); 
        
    if(message.content.startsWith(prefix))
    {
        const args = message.content.slice(prefix.length).trim().split(/ +/);

        if(!args[0]) return message.channel.send(createEmbed("Bot Command", "ion *command*"))

        const command = args.shift().toLowerCase();
        if(!client.commands.has(command)) return message.channel.send(createEmbed("Commands", "Invalid Commands\nType **ion commands** to display all comands"));

        try
        {
            client.commands.get(command).run(client, message, args);
        } catch(error)
        {
            console.log(error)
        }
    }
})

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === '👋welcome-channel👋');

    if(!channel) return;
    
    let avatar = member.user.displayAvatarURL({size: 256})

    const embed = new Discord.MessageEmbed()
    .setTitle(`Welcome ${member.user.tag}`)
    .setDescription("For more details you can use **ion commands**")
    .setImage(avatar)
    .setColor("#0aa321")

    channel.send(embed);

    var role= member.guild.roles.cache.find(role => role.name === "</> MEMBER");
    member.roles.add(role);
})

client.on('guildMemberRemove', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === '❌goodbye-channel❌');

    if(!channel) return;
    
    let avatar = member.user.displayAvatarURL({size: 256})

    const embed = new Discord.MessageEmbed()
    .setTitle(`GoodBye ${member.user.tag}`)
    .setImage(avatar)
    .setColor("#0aa321")

    channel.send(embed);
})

const createEmbed = (title, description, color = null) => {

    const x = new Discord.MessageEmbed()
    .setColor(color ? color : '#FF0000')
    .setTitle(title)
    .setDescription(description);

    return x;
};

client.login(token);
