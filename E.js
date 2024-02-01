const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const config = require('../../config.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('application')
    .setDescription('Submit an application.')
    .addSubCommand(subcommand =>
      subcommand.setName('submit')
        .setDescription('Submit a application.')
        .addStringOption(option =>
          option.setName('application')
            .setDescription('Select an application to submit.')
            .setRequired(true)
            .addChoices(
              { name: 'Ban Appeal', value: 'ban_appeal' },
            )
      )
    .addSubCommand(subcommand =>
      subcommand.setName('accept')
        .setDescription('Accept a application.')
        .addUserOption(option =>
          option.setName('user')
            .setDescription('The user to accept the application.')
            .setRequired(true)
        )
    .addSubCommand(subcommand =>
      subcommand.setName('deny')
        .setDescription('Deny a application.')
        .addUserOption(option =>
          option.setName('user')
            .setDescription('The user to deny the application.')
            .setRequired(true)
        )
      )
    )
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const user = interaction.options.getUser('user');

    if (subcommand === 'submit') {
      const application = interaction.options.getString('application');
      if (application === 'ban_appeal') {
        const modal = new ModalBuilder()
          .setCustomId('ban_appeal_modal')
          .setTitle('Ban Appeal Form');
        const appealInput = new TextInputBuilder()
          .setCustomId('appeal_input')
          .setLabel('Why should your appeal be accepted?')
          .setStyle(TextInputStyle.Paragraph);
        const appealInput2 = new TextInputBuilder()
          .setCustomId('appeal_input2')
          .setLabel('What is your current ban reason?')
          .setStyle(TextInputStyle.Paragraph);
        const appealRow = new ActionRowBuilder()
          .addComponents(appealInput, appealInput2);
        modal.addComponents(appealRow)

        await interaction.showModal(modal);
      }
    } else if (subcommand === 'accept') {
      const user = interaction.options.getUser('user');

      if (!interaction.member.roles.has(config.staff.staff)) {
        return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setTitle('Application Accepted')
        .setDescription(`Your application has been accepted by ${interaction.user.tag}.`)
        .setColor('#00FF00');
      await interaction.reply({ embeds: [embed] });
    } else if (subcommand === 'deny') {
      const user = interaction.options.getUser('user');
      if (!interaction.member.roles.has(config.staff.staff)) {
        return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setTitle('Application Denied')
        .setDescription(`Your application has been denied by ${interaction.user.tag}.`)
        .setColor('#FF0000');
      await interaction.reply({ embeds: [embed] });
    }
  },
};
