/*:
 * @plugindesc A plugin to manage exp sharing
 *
 * @author myenemy
 * 
 * @param Mode
 * @desc How will the exp will be split
 * @type select
 * @option Everyone in party gets the same exp, reserve too
 * @option Everyone in party gets exp, reserve half
 * @option Exp is split by battle members at the end
 * @option Exp by number of actions
 * @option Exp by damage dealt, received, healed or nullified
 * 
 *
 * @help
 * By default, when a character defeats a encounter, they get the same experience as if it was done by a full party.
 * This plugin allows you to manage who gets experience, and how much.
 * The first mode is that the experience is split by all members alike.
 * The second mode splits the experience so active members get twice than reserve ones.
 * The third mode gives experience only to the ones in battle.
 * The fourth, gives exp based on the number of actions a char did. Stunned, frozen, asleep, silent, defend, don't count.
 * The fifth, gives exp based on the health healed by the character, dealt by the character, received, or resisted, by any means.
 * 
 * @Terms of use
 * - Common:
 * -  Free to use as in money.
 * -  Feel free to modify to redistribute it.
 * -  This plugin comes as is, with no guarantees.
 * -  I'll try to give support about it, but I can't say I will do it for sure.
 * - Non Commercial:
 * -  No credit required unless you modify it then credit yourself, in other words,
 *   no claiming as your own!
 * - Commercial:
 * -  Give credit me as the author of this plugin, I don't mind if you do so in some
 *   scene or some easter egg.
 * -  Report any bugs, incompatibilities and issues with this plugin to me, even if
 *   you have someone else fixing them.
 * 
 * 
 */
var parameters = PluginManager.parameters('ME_SharedExp');
var _pluginCommand=Game_Interpreter.prototype.pluginCommand;
var _battleManagerGainExp=BattleManager.gainExp;

BattleManager.gainExp = function()
{
    var mode = parameters["Mode"];
    if (mode)
    {
        var exp = this._rewards.exp;
        switch(mode)
        {
            case "Everyone in party gets the same exp, reserve too":
                var splitexp=Math.round(exp/$gameParty._actors.length);
                $gameParty.allMembers().forEach(function(actor) {
                    actor.gainExp(splitexp);
                });
                break;
            case "Everyone in party gets exp, reserve half":
                var splitexp=exp/$gameParty._actors.length/3;
                $gameParty.allMembers().forEach(function(actor) {
                    actor.gainExp(splitexp);
                });
                $gameParty.battleMembers().forEach(function(actor) {
                    actor.gainExp(splitexp);
                });
                break;
            case "Exp is split by battle members at the end":
                var splitexp=exp/$gameParty.battleMembers.length;
                $gameParty.battleMembers().forEach(function(actor) {
                    actor.gainExp(splitexp);
                });
                break;
            case "Exp by number of actions":

                break;
            case "Exp by damage dealt, received, healed or nullified":

                break;
            default:
                _battleManagerGainExp.call(this);
        }
    }
    else
        _battleManagerGainExp.call(this);
};


BattleManager.startAction = function() {
    var subject = this._subject;
    console.log(subject)
    var action = subject.currentAction();
    console.log(action)
    var targets = action.makeTargets();
    console.log(targets)
    this._phase = 'action';
    this._action = action;
    this._targets = targets;
    subject.useItem(action.item());
    console.log(action.item())
    this._action.applyGlobal();
    this.refreshStatus();
    this._logWindow.startAction(subject, action, targets);
    console.log("\n\n\n\n\n")
    //if (this._subject)
};


Game_Interpreter.prototype.pluginCommand = function(command, args)
{
    var parseCommand=command.toLowerCase();
    
    if (parseCommand=="me_sem")
    {
    }
    else
        _pluginCommand.call(this, command, args);
};
