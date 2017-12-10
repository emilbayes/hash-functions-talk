(module
  (memory (export "memory") 1)

  (func (export "djb2")
    ;; i32 (i32 input.ptr, i32 input.length)
    (param $input.ptr i32)
    (param $input.length i32)
    (result i32)

    (local $hash i32 (i32.const 5381))

    (block $break
      (loop $continue
        (br_if $break
               (i32.eq (get_local $input.ptr)
                       (get_local $input.length)))

        (set_local $hash
          (i32.xor (i32.load8_u (get_local $input.ptr))
                    ;; hash + (hash << 5)
                   (i32.add (get_local $hash)
                            (i32.shl (get_local $hash)
                                     (i32.const 5)))))

        (set_local $input.ptr (i32.add (get_local $input.ptr)
                                       (i32.const 1)))
        (br $continue)
      )
    )

    (get_local $hash)
  )
)
