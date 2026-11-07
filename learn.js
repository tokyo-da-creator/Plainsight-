/* Plainsight · Learn
   Plain-language course on how the U.S. government works. Settled constitutional and
   procedural facts only; who holds each office always comes from live data. */
window.LEARN = {
  lessons: [
    {
      id: 'big-picture', n: 1, hero: 'brief', minutes: 6,
      title: 'The big picture',
      kicker: 'Three branches, one Constitution, and why power is split on purpose.',
      sections: [
        {h: 'One rulebook', p: [
          'The Constitution is the rulebook for the federal government. It was written in 1787, took effect in 1789, and has been amended 27 times. The first ten amendments are the Bill of Rights.',
          'It does two jobs. It creates the government and spells out what each part may do, and it lists things the government may not do to you, such as restricting speech or searching your home without a warrant.']},
        {h: 'Three branches', diagram: 'branches', p: [
          'Power is split three ways so that no single person or group controls everything. Each branch has its own job and its own ways to check the others.']},
        {h: 'Federal, state and local', p: [
          'The national government handles things the Constitution gives it: defense, foreign policy, currency, trade between states, immigration, federal crimes. Everything else is left to the states and the people (the Tenth Amendment). That is why rules for driving, most crimes, schools and elections differ from state to state.',
          'This split is called federalism. When you read about a fight between a state and Washington, it is usually a fight over where that line sits.']},
        {h: 'How the branches check each other', list: [
          'Congress writes laws, but the President can veto them.',
          'Congress can override a veto with two-thirds of each chamber.',
          'The President appoints judges and Cabinet officers, but the Senate must confirm them.',
          'Courts can strike down laws and executive actions that break the Constitution.',
          'Congress controls the money: no spending happens without an appropriation.',
          'The House can impeach the President or a judge; the Senate holds the trial.']},
        {h: 'See it on Plainsight', live: 'counts'},
      ],
      quiz: [
        {q: 'Which branch writes federal laws?', a: ['The President', 'Congress', 'The Supreme Court', 'The Cabinet'], c: 1, why: 'Article I gives all lawmaking power to Congress. The President signs or vetoes; courts interpret.'},
        {q: 'How does Congress override a presidential veto?', a: ['A simple majority in the House', 'A two-thirds vote in both chambers', 'A Supreme Court ruling', 'A national vote'], c: 1, why: 'Overriding a veto takes two-thirds of the House and two-thirds of the Senate.'},
        {q: 'Who confirms Supreme Court justices?', a: ['The House', 'The Senate', 'The Chief Justice', 'The states'], c: 1, why: 'The President nominates; the Senate confirms with a majority vote.'},
        {q: 'Powers not given to the federal government belong to…', a: ['The President', 'The Supreme Court', 'The states and the people', 'Congress'], c: 2, why: 'The Tenth Amendment reserves them to the states and the people.'},
      ],
    },
    {
      id: 'congress', n: 2, hero: 'congress', minutes: 8,
      title: 'Congress',
      kicker: 'Two chambers, who runs them, and how committees decide what moves.',
      sections: [
        {h: 'Two chambers', table: {cols: ['', 'House of Representatives', 'Senate'], rows: [
          ['Members', '435 voting, plus 6 non-voting delegates', '100, two per state'],
          ['Term', '2 years, all seats every election', '6 years, a third up every 2 years'],
          ['Seats based on', 'Population, redrawn after each census', 'Equal for every state'],
          ['Minimum age', '25', '30'],
          ['Only they can', 'Start tax bills; impeach', 'Confirm nominees; ratify treaties; hold impeachment trials'],
          ['Presiding officer', 'Speaker of the House', 'Vice President (votes only to break ties)'],
        ]}},
        {h: 'Who runs each chamber', p: [
          'The party with the most seats is the majority. In the House, the majority elects the Speaker, who controls which bills reach the floor. The Majority Leader schedules floor business and the Whip counts votes. The minority has its own Leader and Whip.',
          'In the Senate, the Majority Leader sets the agenda. The Vice President is President of the Senate but rarely presides; the President pro tempore, by custom the longest-serving senator of the majority, stands in.']},
        {h: 'Leaders right now', live: 'leaders'},
        {h: 'Committees do most of the work', p: [
          'Each chamber splits into committees by subject: Armed Services, Judiciary, Intelligence, Appropriations, and so on. Almost every bill is sent to a committee first. The committee can hold hearings, rewrite the bill in a markup, and vote to send it to the full chamber. Most bills never leave committee.',
          'The committee chair is from the majority party and decides what the committee takes up. The ranking member leads the minority side.']},
        {h: 'Why the Senate needs 60', p: [
          'Senate debate has no automatic end. Ending it takes a cloture vote of three-fifths of senators, normally 60. Refusing to end debate is called a filibuster, so most bills need 60 votes in practice to pass the Senate.',
          'There are exceptions. Nominations need only a majority to end debate (changed in 2013 and 2017). Budget reconciliation bills and Congressional Review Act resolutions cannot be filibustered.'],
          sides: {for: 'Supporters say the 60-vote rule forces compromise and protects the minority party, whichever party that is.', against: 'Critics say it lets a minority block measures a majority supports and makes the Senate slow to act.'}},
      ],
      quiz: [
        {q: 'How often is every House seat up for election?', a: ['Every year', 'Every 2 years', 'Every 4 years', 'Every 6 years'], c: 1, why: 'House members serve two-year terms, so all 435 seats are on the ballot every even-numbered year.'},
        {q: 'Who controls which bills reach the House floor?', a: ['The President', 'The Speaker', 'The Senate Majority Leader', 'The Chief Justice'], c: 1, why: 'The Speaker, elected by the House majority, controls the floor schedule.'},
        {q: 'How many votes does cloture usually take in the Senate?', a: ['51', '60', '67', '100'], c: 1, why: 'Cloture needs three-fifths of senators, normally 60.'},
        {q: 'Where does a new bill usually go first?', a: ['Straight to a floor vote', 'To the President', 'To a committee', 'To the Supreme Court'], c: 2, why: 'Bills are referred to committee, where most of them stop.'},
      ],
    },
    {
      id: 'bill-to-law', n: 3, hero: 'sources', minutes: 7,
      title: 'How a bill becomes law',
      kicker: 'Every step from an idea to the statute books, with real bills moving now.',
      sections: [
        {h: 'The path', diagram: 'billpath'},
        {h: 'Both chambers must pass the exact same text', p: [
          'If the House and Senate pass different versions, they have to settle the differences. They do it either by passing amendments back and forth until they match, or through a conference committee that writes one compromise version both chambers then vote on.']},
        {h: 'The President’s choices', list: [
          'Sign it: it becomes law.',
          'Veto it: it goes back to Congress, which can override with two-thirds of each chamber.',
          'Do nothing for 10 days (Sundays excepted) while Congress is in session: it becomes law without a signature.',
          'Do nothing while Congress has adjourned: it dies. This is a pocket veto.']},
        {h: 'Bills, resolutions and what the letters mean', table: {cols: ['Label', 'What it is', 'Can it become law?'], rows: [
          ['H.R. / S.', 'A bill, from the House or Senate', 'Yes'],
          ['H.J.Res. / S.J.Res.', 'Joint resolution: used for funding stopgaps, disapproving rules, and proposing constitutional amendments', 'Yes, except amendments, which go to the states'],
          ['H.Con.Res. / S.Con.Res.', 'Concurrent resolution: both chambers, e.g. budget resolutions', 'No'],
          ['H.Res. / S.Res.', 'Simple resolution: one chamber’s own business or opinion', 'No'],
        ]}},
        {h: 'Where bills are right now', live: 'billstages'},
      ],
      quiz: [
        {q: 'What happens if the House and Senate pass different versions?', a: ['The Senate version wins', 'They must agree on one text', 'The President picks one', 'Both become law'], c: 1, why: 'Only identical text can go to the President, so the chambers must reconcile their versions.'},
        {q: 'What is a pocket veto?', a: ['A veto overridden by Congress', 'An unsigned bill dying because Congress adjourned', 'A veto of part of a bill', 'A secret veto'], c: 1, why: 'If Congress adjourns and the President does not sign within 10 days, the bill dies.'},
        {q: 'Which of these can never become law?', a: ['H.R. 100', 'S. 25', 'H.Res. 50', 'H.J.Res. 12'], c: 2, why: 'A simple resolution (H.Res.) only governs one chamber’s business or states its opinion.'},
        {q: 'A President leaves a bill unsigned for 10 days while Congress is in session. What happens?', a: ['It dies', 'It becomes law', 'It goes back to committee', 'The Supreme Court decides'], c: 1, why: 'With Congress in session, an unsigned bill becomes law after 10 days, Sundays excepted.'},
      ],
    },
    {
      id: 'votes', n: 4, hero: 'learn', minutes: 6,
      title: 'Reading a roll-call vote',
      kicker: 'What the vote questions mean, how many votes each one needs, and how to read a tally.',
      sections: [
        {h: 'Not every vote is on a bill', p: [
          'Many recorded votes are about procedure: whether to take a bill up, whether to cut off debate, whether to send it back. A party-line vote on procedure can matter as much as the final vote.']},
        {h: 'The questions you will see', live: 'voteguide'},
        {h: 'Reading the tally', list: [
          'Yea and Nay are the votes cast. Most questions pass with a majority of those voting.',
          'Present means the member answered but did not take a side.',
          'Not voting means the member did not vote at all.',
          'Party totals show how each party split. A bill passing 401–14 had support from both parties; one passing 217–207 likely split along party lines.']},
        {h: 'Recent votes, decoded', live: 'votesdecoded'},
      ],
      quiz: [
        {q: 'A bill brought up “under suspension of the rules” needs…', a: ['A simple majority', 'Two-thirds of those voting', '60 votes', 'Unanimous consent'], c: 1, why: 'Suspension skips the normal process, so it needs two-thirds. It is used for less controversial bills.'},
        {q: 'What does a motion to table do?', a: ['Schedules a bill', 'Sets aside the question, usually killing it', 'Sends it to the President', 'Starts debate'], c: 1, why: 'Tabling disposes of a motion or resolution without a direct up-or-down vote on it.'},
        {q: 'A vote passes 217–207. What does that suggest?', a: ['Broad agreement', 'A close vote, likely along party lines', 'A veto override', 'A unanimous vote'], c: 1, why: 'A margin that close usually means the parties voted mostly against each other. Check the party totals to be sure.'},
        {q: 'What does “Present” mean on a roll call?', a: ['Voted yes', 'Voted no', 'Answered without taking a side', 'Was absent'], c: 2, why: 'Present counts toward a quorum but is not a yes or a no.'},
      ],
    },
    {
      id: 'president', n: 5, hero: 'president', minutes: 7,
      title: 'The President and the executive branch',
      kicker: 'What the President can do alone, what needs Congress, and what each kind of order means.',
      sections: [
        {h: 'The job', p: [
          'The President enforces federal law, commands the armed forces, conducts foreign policy, appoints officials, and signs or vetoes bills. A President must be at least 35, a natural-born citizen, and a resident for 14 years, and can be elected at most twice (the 22nd Amendment).',
          'The Vice President takes over if the President dies, resigns or is removed, and breaks tie votes in the Senate.']},
        {h: 'Orders, proclamations and memoranda', table: {cols: ['', 'Executive order', 'Proclamation', 'Memorandum'], rows: [
          ['Usually used for', 'Directing how federal agencies work', 'Ceremonial days, plus some legal actions like tariffs or national monuments', 'Instructions to specific officials'],
          ['Numbered', 'Yes', 'Yes', 'No'],
          ['Published in the Federal Register', 'Yes', 'Yes', 'When it applies broadly'],
          ['Next President can undo it', 'Yes', 'Usually', 'Yes'],
          ['Courts can strike it down', 'Yes, if it exceeds the President’s authority', 'Yes', 'Yes'],
        ]}, p: ['None of these can override a law passed by Congress or the Constitution. An order is only as strong as the authority behind it.']},
        {h: 'The Cabinet', p: [
          'The Cabinet is the Vice President and the heads of the 15 executive departments, plus other officials the President gives Cabinet rank. Department heads are nominated by the President and confirmed by the Senate.']},
        {h: 'The Cabinet right now', live: 'cabinet'},
        {h: 'Latest presidential documents', live: 'eos'},
      ],
      quiz: [
        {q: 'Can an executive order override a law passed by Congress?', a: ['Yes, always', 'No', 'Only in wartime', 'Only with Supreme Court approval'], c: 1, why: 'An order must rest on authority the Constitution or a law already gives the President.'},
        {q: 'How many times can a person be elected President?', a: ['Once', 'Twice', 'Three times', 'No limit'], c: 1, why: 'The 22nd Amendment limits a person to two elected terms.'},
        {q: 'Who confirms Cabinet secretaries?', a: ['The House', 'The Senate', 'The Supreme Court', 'No one'], c: 1, why: 'The Constitution requires the Senate’s advice and consent.'},
        {q: 'What can the next President do with an executive order?', a: ['Nothing', 'Revoke or change it', 'Only ask Congress to repeal it', 'Only a court can change it'], c: 1, why: 'Executive orders are directives from the President, so a later President can revoke them.'},
      ],
    },
    {
      id: 'agencies', n: 6, hero: 'intel', minutes: 8,
      title: 'Agencies: who does what',
      kicker: 'FBI, CIA, NSA, DHS and the rest, and how agencies write rules with the force of law.',
      sections: [
        {h: 'Law enforcement and intelligence', agencies: [
          ['FBI', 'Department of Justice', 'Investigates federal crimes and is the main domestic intelligence and counterintelligence agency. Agents can arrest.'],
          ['CIA', 'Independent agency', 'Collects and analyzes intelligence abroad and carries out covert action when the President directs. It has no police powers inside the U.S.'],
          ['NSA', 'Department of Defense', 'Intercepts and analyzes foreign communications (signals intelligence) and protects national-security computer systems.'],
          ['ODNI', 'Independent agency', 'The Director of National Intelligence leads the 18 agencies of the intelligence community and briefs the President.'],
          ['DOJ', 'Department of Justice', 'Prosecutes federal crimes through U.S. Attorneys in 94 districts, defends the government in court, and runs the FBI, DEA, ATF and U.S. Marshals.'],
          ['DHS / CISA', 'Department of Homeland Security', 'Border security, immigration enforcement, disaster response and the Secret Service. CISA defends federal networks and critical infrastructure from cyberattacks.'],
          ['OFAC', 'Department of the Treasury', 'Runs U.S. economic sanctions: freezes assets and bars Americans from dealing with listed people, companies and countries.'],
          ['State Department', 'Department of State', 'Runs diplomacy, embassies, passports and visas, and designates foreign terrorist organizations.'],
          ['Department of Defense', 'Also styled the Department of War since a 2025 executive order', 'Runs the armed forces. The military may not enforce domestic law except where Congress allows it.'],
        ]},
        {h: 'Rules: law made by agencies', diagram: 'rulemaking', p: [
          'Congress often passes broad laws and leaves the details to agencies. To write a binding rule, an agency normally publishes a proposed rule in the Federal Register, takes public comments, then publishes a final rule. Anyone can comment.',
          'Congress can cancel a new rule with the Congressional Review Act: a joint resolution of disapproval, passed by both chambers with simple majorities and signed by the President. When you see “Providing for congressional disapproval” in the House votes, that is this process.']},
        {h: 'See it live', live: 'rules'},
      ],
      quiz: [
        {q: 'Which agency investigates federal crimes inside the U.S.?', a: ['CIA', 'FBI', 'NSA', 'OFAC'], c: 1, why: 'The FBI is the federal law-enforcement agency. The CIA has no domestic police powers.'},
        {q: 'Who prosecutes federal criminal cases?', a: ['The FBI', 'U.S. Attorneys in the Justice Department', 'The Supreme Court', 'Congress'], c: 1, why: 'The FBI investigates; Justice Department prosecutors bring the charges.'},
        {q: 'What is the usual order for an agency rule?', a: ['Final rule, then comments', 'Proposed rule, public comments, final rule', 'Congress votes on every rule', 'The President signs every rule'], c: 1, why: 'The Administrative Procedure Act requires notice and a chance to comment for most rules.'},
        {q: 'Which agency runs U.S. sanctions?', a: ['State Department', 'Treasury’s OFAC', 'FBI', 'CIA'], c: 1, why: 'The Office of Foreign Assets Control in the Treasury administers sanctions programs.'},
      ],
    },
    {
      id: 'courts', n: 7, hero: 'courts', minutes: 7,
      title: 'The courts',
      kicker: 'How cases climb to the Supreme Court and how to read an opinion.',
      sections: [
        {h: 'Three levels', diagram: 'courts'},
        {h: 'Judges serve for life', p: [
          'Federal judges are nominated by the President and confirmed by the Senate. They hold office “during good behaviour”, which in practice means for life unless they retire, die or are impeached and removed. This is meant to keep them independent from politics.']},
        {h: 'How the Supreme Court picks cases', p: [
          'The losing side in a lower court can ask the Supreme Court to hear the case by filing a petition for certiorari. The Court gets thousands each year and accepts a small fraction. It takes four of the nine justices to grant review.',
          'The Court also handles emergency applications, such as requests to pause a lower-court order while an appeal goes on. These carry docket numbers with an “A”, like 25A388, and are often decided quickly without full argument.']},
        {h: 'Reading an opinion', list: [
          'Majority opinion: the ruling and the Court’s reasons. This is the law.',
          'Concurrence: a justice agrees with the result but adds or uses different reasons.',
          'Dissent: a justice disagrees with the result. It has no legal force but can shape future cases.',
          'Per curiam: an unsigned opinion for the whole Court.',
          'The vote is often reported like 6–3. The author of the majority opinion is listed first.']},
        {h: 'The justices right now', live: 'justices'},
      ],
      quiz: [
        {q: 'How many justices must agree to hear a case?', a: ['Two', 'Four', 'Five', 'All nine'], c: 1, why: 'The “rule of four”: four justices are enough to grant certiorari.'},
        {q: 'What is a dissent?', a: ['The ruling', 'A justice disagreeing with the result', 'An unsigned opinion', 'A lower-court order'], c: 1, why: 'A dissent explains why a justice would have decided the case the other way.'},
        {q: 'What does “per curiam” mean?', a: ['By the Chief Justice', 'An unsigned opinion for the whole Court', 'A dissent', 'A dismissed case'], c: 1, why: 'Latin for “by the court”: no single justice is named as author.'},
        {q: 'How long do federal judges serve?', a: ['10 years', 'Until age 70', 'During good behaviour, in practice for life', '4 years'], c: 2, why: 'Article III gives them tenure during good behaviour.'},
      ],
    },
    {
      id: 'justice-process', n: 8, hero: 'intel', minutes: 6,
      title: 'From charges to sentence',
      kicker: 'What “charged”, “indicted”, “pleaded guilty” and “sentenced” mean, and why the difference matters.',
      sections: [
        {h: 'The steps of a federal case', diagram: 'justice'},
        {h: 'Charged is not convicted', p: [
          'A complaint or indictment is an accusation. Everyone charged is presumed innocent until proven guilty beyond a reasonable doubt or until they plead guilty. That is why Plainsight grades a release about charges C (allegation) and a release about a guilty plea or sentence A (court outcome).',
          'A grand jury, a group of citizens, decides whether there is enough evidence to indict for a serious federal crime. The Fifth Amendment requires it unless the defendant waives it.']},
        {h: 'Justice Department cases by stage', live: 'dojstages'},
      ],
      quiz: [
        {q: 'What is an indictment?', a: ['A conviction', 'A formal charge by a grand jury', 'A sentence', 'An arrest warrant only'], c: 1, why: 'A grand jury indicts when it finds probable cause; it is still an accusation.'},
        {q: 'Someone “charged” in a press release is…', a: ['Guilty', 'Presumed innocent', 'Already sentenced', 'Pardoned'], c: 1, why: 'Charges must be proven in court or admitted by a guilty plea.'},
        {q: 'What comes after a guilty verdict or plea?', a: ['Indictment', 'Arraignment', 'Sentencing', 'Grand jury'], c: 2, why: 'The judge imposes a sentence after a conviction.'},
      ],
    },
    {
      id: 'money', n: 9, hero: 'congress', minutes: 6,
      title: 'Money: budgets, shutdowns and the debt limit',
      kicker: 'Who controls federal spending and what each budget fight is actually about.',
      sections: [
        {h: 'Congress holds the purse', p: [
          'The Constitution says no money may be drawn from the Treasury except by law. The President proposes a budget each year, but only Congress can approve spending.',
          'The federal fiscal year starts October 1. Congress is supposed to pass 12 appropriations bills by then, one for each area of government.']},
        {h: 'Shutdowns and stopgaps', p: [
          'If the appropriations are not passed in time, Congress can pass a continuing resolution, a stopgap that keeps funding at current levels for a while. If neither passes, the affected agencies run out of legal authority to spend and shut down nonessential work. That is a government shutdown.']},
        {h: 'The debt limit is a different thing', p: [
          'The debt limit caps how much the Treasury may borrow to pay for spending Congress already approved. Raising it does not approve new spending; failing to raise it risks the government missing payments it already owes.']},
        {h: 'The scorekeeper', p: [
          'The Congressional Budget Office (CBO) is a nonpartisan agency that estimates what bills will cost. Its cost estimates are often called “scores”. Estimates are projections and can be revised.']},
        {h: 'Latest from CBO', live: 'cbo'},
      ],
      quiz: [
        {q: 'When does the federal fiscal year start?', a: ['January 1', 'April 15', 'July 1', 'October 1'], c: 3, why: 'Fiscal year 2027, for example, runs October 1, 2026 to September 30, 2027.'},
        {q: 'What does a continuing resolution do?', a: ['Raises the debt limit', 'Keeps funding at current levels temporarily', 'Cuts all spending', 'Ends a shutdown permanently'], c: 1, why: 'It is a stopgap so agencies can keep operating while Congress works on full-year bills.'},
        {q: 'Raising the debt limit…', a: ['Approves new spending', 'Lets the Treasury pay for spending already approved', 'Cuts taxes', 'Ends the deficit'], c: 1, why: 'It authorizes borrowing for obligations Congress has already made.'},
      ],
    },
    {
      id: 'elections', n: 10, hero: 'who', minutes: 6,
      title: 'Elections and accountability',
      kicker: 'How the President is chosen, why midterms matter, and how officials can be removed.',
      sections: [
        {h: 'The election calendar', list: [
          'Federal elections are held on the Tuesday after the first Monday in November of even-numbered years.',
          'Every 2 years: all 435 House seats and about a third of the Senate.',
          'Every 4 years: President and Vice President, on one ticket.',
          'Midterms are the elections between presidential years. They often decide which party controls Congress for the rest of a President’s term.']},
        {h: 'The Electoral College', p: [
          'Voters in each state choose electors, not the President directly. There are 538 electors, one for each member of the House and Senate plus three for Washington, D.C. A candidate needs 270 to win. Most states give all their electors to the statewide winner; Maine and Nebraska split theirs by district.',
          'If no one reaches 270, the House picks the President, with each state delegation casting one vote.'],
          sides: {for: 'Supporters say it makes candidates compete across many states, not just the largest cities, and reflects the country as a union of states.', against: 'Critics say it lets a candidate win while losing the national popular vote and focuses campaigns on a few swing states.'}},
        {h: 'Removing officials', p: [
          'The House can impeach (formally charge) the President, Vice President, judges and other civil officers with a simple majority. The Senate then holds a trial; removal takes a two-thirds vote. Members of Congress are not impeached; each chamber can expel its own members with a two-thirds vote.']},
        {h: 'Party control right now', live: 'counts'},
      ],
      quiz: [
        {q: 'How many electoral votes does it take to win the presidency?', a: ['218', '270', '290', '538'], c: 1, why: 'A majority of the 538 electors: 270.'},
        {q: 'What does it take to remove an impeached President?', a: ['A House majority', 'A two-thirds Senate vote', 'A Supreme Court ruling', 'A national referendum'], c: 1, why: 'The House impeaches by majority; the Senate convicts and removes with two-thirds.'},
        {q: 'What is a midterm election?', a: ['A primary', 'A federal election halfway through a presidential term', 'A special election', 'A recall'], c: 1, why: 'Held two years into a presidential term, it covers the whole House and a third of the Senate.'},
      ],
    },
  ],

  // How to read the question on a roll-call vote.
  votes: [
    {re: /suspend the rules/i, name: 'Suspension of the rules', plain: 'A fast track for bills with broad support: limited debate and no amendments.', need: '2/3'},
    {re: /ordering the previous question/i, name: 'Previous question', plain: 'Ends debate on a “rule” and blocks amendments to it. Usually a party-line procedural vote.', need: 'majority'},
    {re: /motion to recommit/i, name: 'Motion to recommit', plain: 'The minority’s last attempt to send the bill back to committee before final passage. It rarely succeeds.', need: 'majority'},
    {re: /motion to table/i, name: 'Motion to table', plain: 'Sets the question aside, which usually kills it without a direct vote on the merits.', need: 'majority'},
    {re: /concur in the senate amendment/i, name: 'Agreeing to Senate changes', plain: 'The House accepts the Senate’s version. If it passes, the bill has cleared Congress.', need: 'majority'},
    {re: /objections of the president|override/i, name: 'Veto override', plain: 'An attempt to pass a bill over the President’s veto.', need: '2/3'},
    {re: /cloture/i, name: 'Cloture', plain: 'A Senate vote to end debate and get past a filibuster.', need: '3/5'},
    {re: /on the nomination/i, name: 'Confirmation', plain: 'The Senate’s vote to confirm a presidential nominee.', need: 'majority'},
    {re: /agreeing to the resolution/i, name: 'Adopting a resolution', plain: 'A vote to adopt a resolution. If it starts with “Providing for consideration”, it is a rule that sets the terms of debate for other bills.', need: 'majority'},
    {re: /on passage|on the bill|on the joint resolution|passage of the bill/i, name: 'Final passage', plain: 'The vote to pass the measure in this chamber.', need: 'majority'},
    {re: /quorum/i, name: 'Quorum call', plain: 'A check that enough members are present to do business.', need: 'none'},
  ],

  glossary: [
    ['Act', 'A bill once it has passed one chamber, or a law once enacted.'],
    ['Amendment', 'A change to a bill, or to the Constitution. Constitutional amendments need two-thirds of Congress and three-quarters of the states.'],
    ['Appropriation', 'A law that provides money for federal agencies to spend.'],
    ['Arraignment', 'The first court hearing after charges, where the defendant enters a plea.'],
    ['Bill', 'A proposed law. House bills are labeled H.R., Senate bills S.'],
    ['Cabinet', 'The Vice President and heads of the executive departments, plus officials the President gives Cabinet rank.'],
    ['Caucus / Conference', 'All members of one party in a chamber.'],
    ['Certiorari', 'A Supreme Court order agreeing to hear a case. Four justices must vote for it.'],
    ['Cloture', 'A Senate vote to end debate, usually needing 60 votes.'],
    ['Committee', 'A group of members that handles bills on one subject.'],
    ['Concurrence', 'An opinion by a justice who agrees with the result but writes separately.'],
    ['Conference committee', 'Members of both chambers who write one compromise version of a bill.'],
    ['Congressional Record', 'The daily official record of what is said and done on the House and Senate floors.'],
    ['Congressional Review Act', 'A law letting Congress cancel a new agency rule by joint resolution with simple majorities.'],
    ['Continuing resolution', 'Temporary funding at current levels to avoid a shutdown.'],
    ['Cosponsor', 'A member who signs on to support a bill after its sponsor.'],
    ['CRS', 'Congressional Research Service: nonpartisan researchers who write reports for Congress.'],
    ['CBO', 'Congressional Budget Office: nonpartisan agency that estimates what bills cost.'],
    ['Debt limit', 'The cap on how much the Treasury may borrow to pay for spending already approved.'],
    ['Delegate', 'A non-voting House member from D.C. or a U.S. territory.'],
    ['Designation', 'Adding a person or company to a sanctions list, freezing their U.S. assets.'],
    ['Dissent', 'An opinion by a justice who disagrees with the Court’s result.'],
    ['Docket', 'A court’s list of cases. Supreme Court numbers with “A” are emergency applications.'],
    ['Electoral College', 'The 538 electors who formally choose the President; 270 wins.'],
    ['Executive order', 'A numbered directive from the President to the executive branch.'],
    ['Federal Register', 'The government’s daily journal of rules, proposed rules, notices and presidential documents.'],
    ['Filibuster', 'Using unlimited Senate debate to block a vote. Ended by cloture.'],
    ['Final rule', 'An agency regulation in its finished, binding form.'],
    ['GAO', 'Government Accountability Office: Congress’s nonpartisan auditor and investigator.'],
    ['Grand jury', 'Citizens who decide whether there is enough evidence to indict.'],
    ['Hearing', 'A committee session to take testimony from officials, experts or the public.'],
    ['Impeachment', 'The House formally charging an official. Removal needs a two-thirds Senate vote.'],
    ['Indictment', 'A formal charge by a grand jury. Still an accusation, not a conviction.'],
    ['Joint resolution', 'A measure labeled H.J.Res. or S.J.Res. that can become law, or propose a constitutional amendment.'],
    ['Majority Leader', 'The majority party’s floor leader; in the Senate, the agenda setter.'],
    ['Markup', 'A committee meeting where members amend and vote on a bill.'],
    ['Memorandum (presidential)', 'An instruction from the President to specific officials; not numbered.'],
    ['Midterm', 'The federal election held halfway through a presidential term.'],
    ['Minority Leader', 'The leader of the party with fewer seats in a chamber.'],
    ['Motion to recommit', 'The minority’s motion to send a bill back to committee before passage.'],
    ['Motion to table', 'A motion that sets a question aside, usually killing it.'],
    ['OFAC', 'Treasury’s Office of Foreign Assets Control, which runs U.S. sanctions.'],
    ['Opinion (court)', 'A court’s written decision and reasoning.'],
    ['Per curiam', 'An unsigned opinion for the whole court.'],
    ['Plea', 'A defendant’s answer to charges: guilty, not guilty, or no contest.'],
    ['Pocket veto', 'A bill dying because the President did not sign it while Congress was adjourned.'],
    ['President pro tempore', 'The senator who presides when the Vice President is absent; by custom the majority’s longest-serving member.'],
    ['Previous question', 'A House motion that ends debate and blocks amendments, usually on a rule.'],
    ['Proclamation', 'A numbered presidential statement, often ceremonial, sometimes with legal effect.'],
    ['Proposed rule', 'A draft regulation published for public comment.'],
    ['Public law', 'A bill that has been enacted. Numbered by Congress, e.g. P.L. 119-111.'],
    ['Quorum', 'The minimum number of members needed to do business: a majority.'],
    ['Ranking member', 'The senior minority-party member on a committee.'],
    ['Reconciliation', 'A budget process that lets certain tax and spending bills pass the Senate with a simple majority.'],
    ['Resolution (simple)', 'H.Res. or S.Res.: one chamber’s rules or opinion; not law.'],
    ['Roll-call vote', 'A recorded vote where each member’s position is listed by name.'],
    ['Rule (House)', 'A resolution setting the terms of debate and amendment for a bill.'],
    ['Rule (agency)', 'A regulation an agency issues under authority from a law.'],
    ['Sanctions', 'Economic restrictions on countries, companies or people, run by Treasury’s OFAC.'],
    ['Sentencing', 'The judge’s punishment after a conviction or guilty plea.'],
    ['Speaker of the House', 'The House’s presiding officer and leader of its majority; second in line to the presidency after the Vice President.'],
    ['Sponsor', 'The member who introduces a bill.'],
    ['Suspension of the rules', 'A House fast track needing two-thirds, used for less controversial bills.'],
    ['Veto', 'The President’s refusal to sign a bill. Congress can override with two-thirds of each chamber.'],
    ['Whip', 'A party leader who counts votes and keeps members in line.'],
  ],
};
