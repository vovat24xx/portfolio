import { Fragment } from 'react'

/**
 * Splits a heading into masked words so GSAP can animate each one.
 * Use "\n" in `text` for a forced line break.
 */
export default function Split({ text, as: Tag = 'span', className = '', ...rest }) {
  const lines = text.split('\n')
  return (
    <Tag className={`split ${className}`} aria-label={text.replace(/\n/g, ' ')} {...rest}>
      {lines.map((line, li) => (
        <span className="split__l" key={li} aria-hidden="true">
          {line.split(' ').map((w, i, arr) => (
            <Fragment key={i}>
              <span className="split__w">
                <span className="split__i">{w}</span>
              </span>
              {i < arr.length - 1 ? ' ' : null}
            </Fragment>
          ))}
        </span>
      ))}
    </Tag>
  )
}
