/*
  Name: [Pranav Bellie]
  Date: 10.29.2026
  CSC 372-01

  This file holds the CastList component. It lists cast members and the
  characters they play, up to a limit. The gallery cards use a short
  limit and the detail page uses a longer one.
*/

import { NOT_AVAILABLE } from '../utils.js';

/**
 * A list of cast members. Each item's key is built from the person's id
 * and the character's id (not the array index). The character id is
 * needed too because one person can appear twice for two characters.
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.members - Cast entries from TVmaze, each
 *     with a person and a character.
 * @param {number} props.limit - The most people to list.
 * @return {JSX.Element} A list, or "Not available" if there is no cast.
 */
function CastList({ members, limit }) {
  let usable = members.filter(function (member) {
    return member && member.person
      && typeof member.person.name === 'string'
      && typeof member.person.id === 'number';
  });

  if (usable.length === 0) {
    return <p>{NOT_AVAILABLE}</p>;
  }

  return (
    <ul className="cast-list">
      {usable.slice(0, limit).map(function (member) {
        let characterId = member.character ? member.character.id : 'none';
        let characterName = member.character && typeof member.character.name === 'string'
          ? ' as ' + member.character.name
          : '';
        return (
          <li key={member.person.id + '-' + characterId}>
            {member.person.name}{characterName}
          </li>
        );
      })}
    </ul>
  );
}

export default CastList;
