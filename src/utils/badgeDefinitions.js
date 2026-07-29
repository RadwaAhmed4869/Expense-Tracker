import { QUEST_TYPES } from "./questDefinitions";

export const badgeCatalog = [
  {
    id: "first-expense",
    nameKey: "badge.first-expense.name",
    descriptionKey: "badge.first-expense.description",
    condition: (state, expenses) => expenses.length >= 1,
  },
  {
    id: "first-quest",
    nameKey: "badge.first-quest.name",
    descriptionKey: "badge.first-quest.description",
    condition: (state) => state.quests.some((quest) => quest.status === "completed"),
  },
  {
    id: "level-5",
    nameKey: "badge.level-5.name",
    descriptionKey: "badge.level-5.description",
    condition: (state) => state.level >= 5,
  },
  {
    id: "streak-3",
    nameKey: "badge.streak-3.name",
    descriptionKey: "badge.streak-3.description",
    condition: (state) => state.streakCount >= 3,
  },
  {
    id: "budget-keeper",
    nameKey: "badge.budget-keeper.name",
    descriptionKey: "badge.budget-keeper.description",
    condition: (state) =>
      state.quests.some(
        (quest) => quest.type === QUEST_TYPES.CATEGORY_BUDGET && quest.status === "completed"
      ),
  },
  {
    id: "ledger-master",
    nameKey: "badge.ledger-master.name",
    descriptionKey: "badge.ledger-master.description",
    condition: (state, expenses) => expenses.length >= 25,
  },
];
