import STYLE from 'constants/style'

export default {
  base: {
    marginLeft: 40,
    marginRight: 40,
    marginTop: 40,
  },

  editControls: {
    fontWeight: STYLE.FONT.WEIGHT.SEMI_BOLD,
    fontSize: 14,
    color: STYLE.COLOR.GREY,
    letterSpacing: STYLE.FONT.LETTER_SPACING.TINY,
  },
  editControls__startButton: {
    color: STYLE.COLOR.BLUE,
  },
  editControls__endButton: {
    color: STYLE.COLOR.RED,
  },

  storeName: {
    marginTop: 5,

    fontSize: 32,
    fontWeight: STYLE.FONT.WEIGHT.BOLD,
    letterSpacing: STYLE.FONT.LETTER_SPACING.TINY,
  },
  storeName_input: {
    marginTop: 5,

    fontSize: 32,
    fontWeight: STYLE.FONT.WEIGHT.BOLD,
    letterSpacing: STYLE.FONT.LETTER_SPACING.TINY,
  },

  itemsList: {
    overflow: 'visible',
    overflowY: 'auto',
    // overflowX: 'auto',
    marginTop: 10,
  },
}
