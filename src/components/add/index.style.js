import STYLE from 'constants/style'

export default {
  base: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  title: {
    display: 'flex',
    flex: 0.25,
    width: '80%',
  },

  title__text: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: '80%',
    fontWeight: 'bold',

    fontSize: 32,
    color: STYLE.COLOR.BLUE,
  },

  inputForm: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '80%',
    flex: 0.3,
  },

  inputForm_firstRow: {
    width: '100%',
    flex: 0.5,
  },

  inputForm_secondRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 0.5,
  },

  photo: {
    display: 'flex',
    width: '80%',
    flex: 0.35,
    flexDirection: 'column',
  },

  photo__text: {
    flex: 0.2,
    fontWeight: STYLE.FONT.WEIGHT.BOLD,
    fontSize: 14,
    color: STYLE.COLOR.BLUE,
  },

  photo__button: {
    display: 'flex',
    width: '100%',
    flex: 1.67,
    flexDirection: 'column',
    alignItems: ' center',
    justifyContent: 'center',

    border: `1px dashed ${STYLE.COLOR.GREY}`,
    borderRadius: 4,
    boxSizing: 'border-box',
  },

  DashedBox: {
    position: 'absolute',
    bottom: '390px',
    height: '10px',
    width: '300px',
  },

  photo__img: {
    height: '100%',
    width: '100%',
    objectFit: 'contain',
  },

  footer: {
    width: '80%',
    display: 'flex',
    flex: 0.25,
    alignItems: ' center',
    justifyContent: 'center',
  },
}
